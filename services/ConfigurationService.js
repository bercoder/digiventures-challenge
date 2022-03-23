class ConfigurationService {
  constructor(model) {
    this.model = model; //configuration page model
  }

  async index() {
    const pages = await this.model.find({});
    return pages;
  }

  async getByPath(path) {
    const page = await this.model.find({
      path
    })

    return page;
  }

  async getById(id) {
    const page = await this.model.findById(id);

    return page;
  }

  async searchByPath(path) {
    const page = await this.model.find({
      path: { $regex: path.toLowerCase()}
    }, {path: 1})

    return page;
  }
}

module.exports = ConfigurationService;
