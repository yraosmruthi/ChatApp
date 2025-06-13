const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    const extraDetail = err.errors?.[0]?.message || "Validation failed.";
    return res.status(422).json({
      message: "Fill the input properly",
      extraDetails: extraDetail,
    });
  }
};

module.exports = validate;
