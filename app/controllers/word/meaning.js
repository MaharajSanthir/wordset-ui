import Ember from 'ember';

export default Ember.ObjectController.extend({
  canEdit: function() {
    return !this.get("model").get("hasProposal");
  }.property("hasProposal"),
  hasOpenProposal: function() {
    return this.get("hasProposal") && (this.get("openProposal.state") === "open")
  }.property("hasProposal", "openProposal", "openProposal.state"),
  displayEdit: function() {
    return (this.get("canEdit") &&
            this.get("editing") &&
            !this.get("hasProposal"));
  }.property("canEdit", "editing"),
  actions: {
    startEditing: function() {
      if(this.get("session").get("isAuthenticated")) {
        this.set("meaningProposal", this.store.createRecord("proposal", {
          meaning: this.get("model"),
          def: this.get("def"),
          example: this.get("example"),
        }));
        this.set("editing", true);
      } else {
        this.flash.notice("You must login to propose changes!");
      }
    },
    cancel: function() {
      this.get("meaningProposal").destroy();
      this.set("editing", false);
    }
  }
});
