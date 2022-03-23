const { Schema, model } = require('mongoose');

const PageSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  title: {type: String, required: Boolean},
  inputs: [{
    type: {
      type: String,
      required: true
    },
    name: String,
    label: String,
    regex: String,
    method: String,
    to: String,
    target: String,
    text: String,    
    required: Boolean,
  }],
  conditions: {
    validations: [
      {
        comparision: String,
        input: String,
        values: [String]
      }
    ],
    render: [
      [
        {
          comparision: String,
          input: String,
          values: [String]
        }
      ]
    ]
  },
  options: [
    { 
      value: String, 
      label: String 
    },
  ]
});

const Page = model('Page', PageSchema);

module.exports = Page;