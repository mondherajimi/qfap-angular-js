//////////////
// SERVICES //
//////////////

class PagesService {

  /*@ngInject*/
  constructor($q, Api, UserService, toastr) {
    this.$q = $q;
    this.Api = Api;
    this.currentUser = UserService;
    this.toastr = toastr;
  }

  initPage() {

    this.page = {
      author: this.currentUser.getId(),
      // mainImage: {
      //   // src: 'http://api-site.paris.fr/images/118407.jpg',
      //   src: 'https://api-site.paris.fr/images/FZ9A2709_DxO',
      //   // src: 'https://api-site.paris.fr/images/81080',
      //   alt: 'text alternatif',
      //   title: 'et le titre'
      // },
      // components: require('./article/article.js').structure,
      components: [],
      anchors: []
    };
  }

  // PAGE

  fetchPage(id, populate) {
    const query = {};

    if (populate) {
      query.populate = populate;
    }

    this.Api.get('/pages/' + id, query)
      .then((success) => {
        console.log('PAGES', success)

        this.page = success.data;

        return;
      });
  }

  updatePage(apiEntry, saveData) {
    let deferred = this.$q.defer();

    this.Api.post(apiEntry, saveData).then(
      (success) => { deferred.resolve(success); },
      (error) => { deferred.reject(error); }
    );

    return deferred.promise;
  }

  // WRITER

  getWriter() {
    if (this.page && this.page.article && _.has(this.page.article, 'writer')) {
      return this.page.article.writer;
    }

    return;
  }
  setWriter(id) {
    if (!this.page) return;

    this.page.article = this.page.article || {};
    this.page.article.writer = id;
  }

}


////////////
// EXPORT //
////////////

export default PagesService;
