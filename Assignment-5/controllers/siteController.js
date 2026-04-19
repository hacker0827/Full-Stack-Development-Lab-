const mongoose = require("mongoose");
const Package = require("../models/Package");
const Inquiry = require("../models/Inquiry");
const { isDatabaseConnected } = require("../config/db");
const samplePackages = require("../data/samplePackages");

function buildQuery(search, maxPrice) {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  if (maxPrice && Number(maxPrice) > 0) {
    query.price = { $lte: Number(maxPrice) };
  }

  return query;
}

function sortPackages(packages, sort) {
  const sortedPackages = [...packages];

  sortedPackages.sort((left, right) => {
    if (sort === "price-asc") {
      return left.price - right.price;
    }

    if (sort === "price-desc") {
      return right.price - left.price;
    }

    if (sort === "duration") {
      return left.durationDays - right.durationDays;
    }

    if (right.rating !== left.rating) {
      return right.rating - left.rating;
    }

    return left.price - right.price;
  });

  return sortedPackages;
}

async function getPackages(query = {}, sort = "popular", limit = null) {
  if (isDatabaseConnected()) {
    let sortOptions = { rating: -1, price: 1 };
    if (sort === "price-asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price-desc") {
      sortOptions = { price: -1 };
    } else if (sort === "duration") {
      sortOptions = { durationDays: 1 };
    }

    let dbQuery = Package.find(query).sort(sortOptions);
    if (limit) {
      dbQuery = dbQuery.limit(limit);
    }

    return dbQuery.lean();
  }

  let packages = [...samplePackages];

  if (query.$or) {
    const searchTerms = query.$or.map((condition) => {
      const [field, value] = Object.entries(condition)[0];
      return { field, term: value.$regex.toLowerCase() };
    });

    packages = packages.filter((pkg) =>
      searchTerms.some(({ field, term }) => {
        const value = pkg[field];
        if (Array.isArray(value)) {
          return value.some((item) => String(item).toLowerCase().includes(term));
        }

        return String(value || "").toLowerCase().includes(term);
      })
    );
  }

  if (query.price && typeof query.price.$lte === "number") {
    packages = packages.filter((pkg) => pkg.price <= query.price.$lte);
  }

  if (typeof query.featured === "boolean") {
    packages = packages.filter((pkg) => pkg.featured === query.featured);
  }

  packages = sortPackages(packages, sort);

  if (limit) {
    packages = packages.slice(0, limit);
  }

  return packages;
}

async function getPackageById(id) {
  if (isDatabaseConnected()) {
    return Package.findById(id).lean();
  }

  return samplePackages.find((pkg) => String(pkg._id) === String(id)) || null;
}

async function renderHome(req, res) {
  const featuredPackages = await getPackages({ featured: true }, "popular", 6);

  res.render("home", {
    title: "Skyline Trails | Travel Agency",
    featuredPackages,
    databaseAvailable: isDatabaseConnected()
  });
}

async function renderPackages(req, res) {
  const search = (req.query.search || "").trim();
  const maxPrice = req.query.maxPrice || "";
  const sort = req.query.sort || "popular";

  const query = buildQuery(search, maxPrice);
  const packages = await getPackages(query, sort);

  res.render("packages", {
    title: "Travel Packages",
    packages,
    filters: { search, maxPrice, sort },
    databaseAvailable: isDatabaseConnected()
  });
}

async function renderPackageDetails(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).render("error", {
        title: "Package Not Found",
        message: "The selected package is not available.",
        actionText: "Browse Packages",
        actionHref: "/packages"
      });
    }

    const pkg = await getPackageById(req.params.id);

    if (!pkg) {
      return res.status(404).render("error", {
        title: "Package Not Found",
        message: "The selected package is not available.",
        actionText: "Browse Packages",
        actionHref: "/packages"
      });
    }

    return res.render("package-details", {
      title: `${pkg.name} | Package Details`,
      pkg
    });
  } catch (error) {
    return next(error);
  }
}

async function renderContact(req, res) {
  const packages = await getPackages({}, "popular");
  const success = req.query.success === "1";

  res.render("contact", {
    title: "Contact & Booking Inquiry",
    packages,
    success,
    databaseAvailable: isDatabaseConnected(),
    errors: [],
    formData: {}
  });
}

function validateInquiry(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Please enter a valid full name.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!data.phone || data.phone.trim().length < 8) {
    errors.push("Please enter a valid phone number.");
  }

  if (!data.packageId) {
    errors.push("Please select a package.");
  }

  if (!data.travelers || Number(data.travelers) < 1) {
    errors.push("Travelers must be at least 1.");
  }

  if (!data.travelDate) {
    errors.push("Please select a travel date.");
  }

  return errors;
}

async function submitInquiry(req, res) {
  const packages = await getPackages({}, "popular");
  const formData = {
    name: req.body.name || "",
    email: req.body.email || "",
    phone: req.body.phone || "",
    packageId: req.body.packageId || "",
    travelers: req.body.travelers || "",
    travelDate: req.body.travelDate || "",
    message: req.body.message || ""
  };

  if (!isDatabaseConnected()) {
    return res.status(503).render("contact", {
      title: "Contact & Booking Inquiry",
      packages,
      success: false,
      databaseAvailable: false,
      errors: ["Inquiry submission is disabled in offline demo mode. Connect MongoDB to enable form saving."],
      formData
    });
  }

  const errors = validateInquiry(formData);
  if (formData.packageId && !mongoose.Types.ObjectId.isValid(formData.packageId)) {
    errors.push("Please select a valid package.");
  }

  if (formData.packageId && mongoose.Types.ObjectId.isValid(formData.packageId)) {
    const packageExists = await Package.exists({ _id: formData.packageId });
    if (!packageExists) {
      errors.push("Selected package does not exist.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).render("contact", {
      title: "Contact & Booking Inquiry",
      packages,
      success: false,
      databaseAvailable: true,
      errors,
      formData
    });
  }

  await Inquiry.create({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    packageId: formData.packageId,
    travelers: Number(formData.travelers),
    travelDate: new Date(formData.travelDate),
    message: formData.message
  });

  return res.redirect("/contact?success=1");
}

module.exports = {
  renderHome,
  renderPackages,
  renderPackageDetails,
  renderContact,
  submitInquiry
};
