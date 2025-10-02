const routes = {
  public: {
    home: {
      name: 'Home',
      route: 'PublicHome',
      iconName: '',
      iconType: ''
    },
    signIn: {
      name: 'Sign In',
      route: '',
      iconName: '',
      iconType: ''
    },
    article: {
      name: 'Article',
      route: 'PublicArticle',
      iconName: '',
      iconType: ''
    },
    welcome: {
      name: 'Welcome',
      route: 'PublicWelcome',
      iconName: '',
      iconType: ''
    },
  },
  user: {
    search: {
      name: 'Search',
      route: 'UserSearch',
      iconName: '',
      iconType: ''
    },
    hashtag: {
      name: 'Hashtag Listing',
      route: 'UserHashtagListing',
      iconName: '',
      iconType: ''
    },
    like: {
      name: 'Like',
      route: 'UserLike',
      iconName: '',
      iconType: ''
    },
    share: {
      name: 'Share',
      route: 'UserShare',
      iconName: '',
      iconType: ''
    },
    squad: {
      name: 'Squad',
      route: 'UserSquad',
      iconName: '',
      iconType: ''
    },
    video: {
      name: 'Videos Premium',
      route: 'UserPremiumVideo',
      iconName: '',
      iconType: ''
    },
    chat: {
      name: 'Live Chat',
      route: 'UserLiveChat',
      iconName: '',
      iconType: ''
    },
    team: {
      name: 'Team',
      route: 'UserTeam',
      iconName: '',
      iconType: ''
    },
    story: {
      name: 'Story',
      route: 'UserStory',
      iconName: '',
      iconType: ''
    },
    add: {
      name: 'Add',
      route: 'UserAdd',
      iconName: '',
      iconType: ''
    },
    create: {
      name: 'Create',
      route: 'UserCreate',
      iconName: '',
      iconType: ''
    },
    post: {
      name: 'Post',
      route: 'UserPost',
      iconName: '',
      iconType: ''
    },
    comment: {
      name: 'Comments',
      route: 'UserComments',
      iconName: '',
      iconType: ''
    },
    poll: {
      name: 'Poll',
      route: 'UserPoll',
      iconName: '',
      iconType: ''
    },
    groupAdmin: {
      name: 'Group Admin',
      route: 'UserNewRequest',
      iconName: '',
      iconType: ''
    },
    createGroup: {
      name: 'Create Group',
      route: 'UserCreateGroup',
      iconName: '',
      iconType: ''
    },
    AddMember: {
      name: 'Add Member',
      route: 'UserAddMember',
      iconName: '',
      iconType: ''
    },
    groupChat: {
      name: 'Group Chat',
      route: 'UserGroupChat',
      iconName: '',
      iconType: ''
    },
    register: {
      name: 'Register',
      route: '',
      iconName: '',
      iconType: ''
    },
    login: {
      name: 'Sign In',
      route: '',
      iconName: '',
      iconType: ''
    },
    contact: {
      name: 'Contact',
      route: 'UserContactUs',
      iconName: '',
      iconType: ''
    },
    profile: {
      name: 'Profile',
      route: 'UserProfile',
      iconName: '',
      iconType: ''
    },
    setting: {
      name: 'Settings',
      route: 'UserSettings',
      iconName: '',
      iconType: ''
    },
  }
}

export default {
  public: [
    routes.public.home,
    routes.public.signIn,
    routes.public.article,
    routes.public.welcome
  ],
  session: [
    routes.public.home
  ]
}
