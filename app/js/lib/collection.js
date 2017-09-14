Backbone.Collection = Backbone.Collection.extend({
  // Name is required for specific collections.
  // See /app/js/lib/collections/examples.collection.js. For example:
  // name: 'BaseCollection',

  /*
    As an example the url function below will use build a url based on:
      parent: set a model to have a parent (model.parent = other_model)
      urlRoot: Set this key to specify a unique url route
        Without urlRoot the url will be built with the name key of the model
  */
  // url: function() {
  //   var url = '';
  //
  //   // If there is a parent place that its url in the string first
  //   if (!!this.parent){
  //     url += this.parent.url();
  //   }
  //
  //   // If there is a urlRoot use it. Otherwise use the model name
  //   if (!!this.urlRoot){
  //     url += this.urlRoot;
  //   }
  //   else{
  //     url += '/'+this.name.toUnderscore();
  //   }
  //
  //   return url;
  // },
  
});
