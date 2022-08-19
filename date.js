exports.getDate = function () {
  const today = new Date();
  const dateFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleDateString("en-BE", dateFormatOptions);
}

exports.getDay = function () {
    const today = new Date();
    const dateFormatOptions = {
      weekday: "long",
    };
  
    return today.toLocaleDateString("en-BE", dateFormatOptions);
  }

  console.log(module.exports);
