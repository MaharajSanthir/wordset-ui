import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import ENV from '../config/environment';
import Proposal from '../models/proposal';
/* global ga */
/* global mixpanel */

export default Ember.Route.extend(ApplicationRouteMixin).extend({
  notifier: Ember.inject.service(),
  activate: function() {
    this.store.find('lang');
    return this.store.find('word_list');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor("panel.messages").set("model", this.store.find('message'));
    if(controller.get("username")) {
      var _this = this;
      this.store.find("user", {user_id: controller.get("username")}).then(function(users) {
        _this.controllerFor("panel.scoreboard").set("list", users);
      }, function() { });

    }
    controller.set("activeProject", this.store.find("project", "current"));
  },

  // This saves the previous transition for going back
  // to the user's original page when signing in
  // http://stackoverflow.com/questions/21122503/emberjs-return-to-current-route-after-login
  beforeModel: function(transition) {
    this._saveTransition(transition);
  },

  actions: {
    willTransition: function(transition) {
      Ember.$(document).attr('title', 'Wordset – the Collaborative Dictionary');

      // This saves the previous transition for going back
      // to the user's original page when signing in
      // http://stackoverflow.com/questions/21122503/emberjs-return-to-current-route-after-logi
      this._saveTransition(transition);
    },
    didTransition: function() {
      this.hup.to();
      if (ENV.environment === 'production') {
        Ember.run(function() {
          ga('send', 'pageview', {
            'page': window.location.pathname,
            'title': document.title,
          });
        });
      }
      //this.controllerFor("search").send("clear");
      this.controller.set("showMenu", false);
    },
    randomProposal: function(proposal_id) {
      var _this = this;
      this.intermediateTransitionTo('loading');
      Proposal.random(proposal_id).then(function(data) {
        if(data.proposal !== undefined) {
          _this.store.pushPayload("proposal", data);
          _this.transitionTo('proposal.index', data.proposal.id);
        } else {
          _this.get("notifier").show("Yay! You voted on all open proposals!", {name: "Alert"});
          _this.transitionTo('proposals');
        }
      }, function() {
        //_this.send("randomProposal")
      });
    },
    log: function(category, name) {
      var metaData = {"url": window.location.pathname, "user": this.get("session").get("username")};
      if(ENV.environment === "production") {
        Ember.run(function() {
          mixpanel.track(category + " " + name, metaData);
          ga('send', 'event', category, name);
        });
      } else {
        // console.log(name, metaData);
      }
    },
  },
  _saveTransition: function(transition) {
    if(transition.targetName !== ("users.login" || "users.new")) {
      this.controllerFor("users.login").set("previousTransition", transition);
    }
  }
});
