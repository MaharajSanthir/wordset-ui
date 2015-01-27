import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("index", {path: "/"});
  this.resource("word", {path: "/word/:word_id"}, function() {
  });
  this.route("login");
  this.resource("user", function() {
    this.route("new");
    this.route("login");
  });
  this.resource("proposals");
  this.resource("proposal", {path: "/proposal/:proposal_id"});
  this.resource("faqs");

  //this.resource("submit-proposal");

});

export default Router;
