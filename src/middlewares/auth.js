const adminAuth = (req, res, next) => {
    const token = 'xyz';
    const isAdminAuthenticated = token === 'xyz';
    console.log('checking admin auth');
    if (isAdminAuthenticated) {
        next();
    } else {
        res.status(401).send('Admin not authorized');
    }
};

const userAuth = (req, res, next) => {
    const token = 'xyz';
    const isUserAuthenticated = token === 'xyz';
    console.log('checking user auth');
    if (isUserAuthenticated) {
        next();
    } else {
        res.status(401).send('User not authorized');
    }
};

module.exports = {
    adminAuth,
    userAuth
};