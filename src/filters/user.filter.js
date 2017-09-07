////////////
// FILTER //
////////////

export function getFullName() {
  return function(user) {

    if (!_.isObject(user)) return "";

    var hasLastName = (user.lastName !== "");
    var hasFirstName = (user.firstName !== "");
    var fullName = "";

    fullName += (hasFirstName) ? user.firstName : "";
    fullName += (hasLastName && hasFirstName) ? " " : "";
    fullName += (hasLastName) ? user.lastName : "";

    fullName += (fullName === "") ? user.email : "";

    return fullName;
  };
}