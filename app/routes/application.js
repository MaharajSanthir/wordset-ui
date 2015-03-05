import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import ENV from '../config/environment';
import Proposal from '../models/proposal';
/* global ga */
/* global mixpanel */

export default Ember.Route.extend(ApplicationRouteMixin).extend({
  activate: function() {
    return this.store.find('word_list');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor("messages.index").set("model", this.store.find('message'));
  },

  actions: {

    willTransition: function() {
      Ember.$(document).attr('title', 'Wordset – the Collaborative Dictionary');
    },
    didTransition: function() {
      if (ENV.environment === 'production') {
        Ember.run(function() {
          ga('send', 'pageview', {
            'page': window.location.pathname,
            'title': document.title,
          });
        });
      }
      this.controllerFor("search").send("clear");
      this.controller.set("showMenu", false);
    },
    randomProposal: function() {
      var _this = this;
      this.replaceWith('loading');
      Proposal.random().then(function(data) {
        _this.store.pushPayload("proposal", data);
        _this.transitionTo('proposal.index', data.proposal.id);
      }, function() {
        _this.send("randomProposal")
      });
    },
    log: function(name) {
      var metaData = {"url": window.location.pathname, "user": this.get("session").get("username")};
      if(ENV.environment === "production") {
        Ember.run(function() {
          mixpanel.track(name, metaData);
        });
      } else {
        console.log(name, metaData);
      }
    },
  }
});
