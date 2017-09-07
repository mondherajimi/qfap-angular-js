
//////////////
// SERVICES //
//////////////

class UserService {

  /*@ngInject*/
  constructor($filter, $cookies, $localStorage, USER_ACCESS) {
    this.$filter = $filter;
    this.$cookies = $cookies;
    this.$localStorage = $localStorage;
    this.USER_ACCESS = USER_ACCESS;

    this.mcpAuth = $cookies.get('mcpAuth') || $cookies.get('pcuid');
    this.user = $localStorage.user;
  }

  getFullName() {
    return this.$filter('getFullName')(this.user);
  }

  getGroup() {
    if (!_.has(this.user, 'group')) return;

    return this.user.group;
  }

  getId() {
    if (!_.has(this.user, 'id')) return;

    return this.user.id;
  }

  isAuthenticated() {
    return !!this.mcpAuth;
  }

  hasAccess(access) {
    const user = this.user;
    return (user && user.role && this.isAuthenticated() && (access & user.role));
  }
  isUser() { return this.user.role && (parseInt(this.user.role) === this.USER_ACCESS.userRoles.user); }
  isContributor() { return this.user.role && (parseInt(this.user.role) === this.USER_ACCESS.userRoles.contributor); }
  isModerator() { return this.user.role && (parseInt(this.user.role) === this.USER_ACCESS.userRoles.moderator); }
  isRedactor() { return this.user.role && (parseInt(this.user.role) === this.USER_ACCESS.userRoles.redactor); }
  isAdmin() { return this.user.role && (parseInt(this.user.role) === this.USER_ACCESS.userRoles.admin); }

  store(data) {
    this.mcpAuth = data.mcpAuth;
    this.user = data.user;

    this.$cookies.put('mcpAuth', data.mcpAuth, { expires: 'Session' });
    this.$localStorage.user = data.user;
  }

  destroy() {
    this.mcpAuth = undefined;
    this.user = undefined;

    this.$cookies.remove('mcpAuth');
    delete this.$localStorage.user;
  }
}


////////////
// EXPORT //
////////////

export default UserService;
