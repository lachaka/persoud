export default class UserController {
    construct() {

    }

    allAccess = (req, res) => {
        res.status(200).send("Public Content.");
    };

    userAccess= (req, res) => {
        res.status(200).send("User Content.");
    };

    adminAccess = (req, res) => {
        res.status(200).send("Admin Content.");
    };

    moderatorAccess = (req, res) => {
        res.status(200).send("Moderator Content.");
    };
};