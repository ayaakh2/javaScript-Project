const profileName = document.getElementById("profileName");
const fieldUsername = document.getElementById("fieldUsername");
const fieldPhone = document.getElementById("fieldPhone");
const fieldGender = document.getElementById("fieldGender");
const fieldNationalId = document.getElementById("fieldNationalId");

const avatarMale = document.getElementById("avatarMale");
const avatarFemale = document.getElementById("avatarFemale");
const artMale = document.getElementById("artMale");
const artFemale = document.getElementById("artFemale");

window.onload = function () {
    const student = requireRole("student");
    if (!student) return;

    fillFields(student);
    showArtwork(student.gender);
};

/*   Fields   */
function fillFields(student) {
    profileName.textContent = student.fullName || "—";
    fieldUsername.textContent = student.username || "—";
    fieldPhone.textContent = student.phone || "—";
    fieldGender.textContent = capitalise(student.gender);
    fieldNationalId.textContent = student.nationalId || "—";
}

/* Stored lowercase by the teacher's form; shown capitalized. */
function capitalise(value) {
    if (!value) return "—";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/*   Artwork   */
function showArtwork(gender) {
    // Anything that isn't "female" falls back to the male set, so a missing or
    // unexpected value still renders a complete page rather than a blank space.
    const female = String(gender).toLowerCase() === "female";

    (female ? avatarFemale : avatarMale).classList.remove("u-hidden");
    (female ? artFemale : artMale).classList.remove("u-hidden");
}
