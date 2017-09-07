////////////
// IMPORT //
////////////

import loginModule from './login/login.module';
import dashboardModule from './dashboard/dashboard.module';

// pages
import pagesModule from './pages/pages.module';

// manage
import usersModule from './users/users.module';
import authorsModule from './authors/authors.module';
import disciplinesModule from './disciplines/disciplines.module';
import tagsModule from './tags/tags.module';
import placesModule from './places/places.module';
import messagesmoderationModule from './messagesmoderation/messagesmoderation.module';
import messagesbureauxModule from './messagesbureaux/messagesbureaux.module';
import quizzesModule from './quizzes/quizzes.module';

////////////
// EXPORT //
////////////

export default angular.module('qfap.modules', [
    loginModule,
    dashboardModule,

    // pages
    pagesModule,

    // manage
    usersModule,
    authorsModule,
    disciplinesModule,
    tagsModule,
    placesModule,
    messagesmoderationModule,
    messagesbureauxModule,
	quizzesModule
  ])
  .name;