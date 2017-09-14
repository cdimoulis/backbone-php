Backbone.Model = Backbone.Model.extend({
  // Name is required for specific models.
  // See /app/js/lib/models/example.model.js. For example:
  // name: 'BaseModel',

  /*
    As an example the url function below will use build a url based on:
      parent: set a model to have a parent (model.parent = other_model)
      urlRoot: Set this key to specify a unique url route
        Without urlRoot the url will be built with the name key of the model
        converted to underscore (UserGroup -> user_group)
      Lastly if there is an id in the model attributes it will be appended at
      the end of the url.
  */
  // url: function(){
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
  //   // If there is an id attribute then place that at the end
  //   if (this.has('id') && !!this.get('id')){
  //     url += '/'+this.get('id');
  //   }
  //
  //   return url;
  // },

});
