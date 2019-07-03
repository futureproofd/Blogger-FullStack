class AuthService {
  constructor(passport) {
    this.passport = passport;
    this.authGoogle = this.authGoogle.bind(this);
    this.authGoogleCallback = this.authGoogleCallback.bind(this);
  }

  authGoogle() {
    return this.passport.authenticate('google', {
      scope: ['profile', 'email'],
    });
  }

  authGoogleCallback() {
    return this.passport.authenticate('google');
  }
}

module.exports = AuthService;
