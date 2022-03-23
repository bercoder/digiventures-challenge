class ConfigurationController {
  constructor(configurationService) {
    this.configurationService = configurationService;
  }

  /*
  returns:
    200 if configuration exists
    404 if configuration doesn't exists
  */
  async get(req, res) {
    const { path } = req.params;
    const isNumber = /^\d+$/;

    const page = isNumber.test(path)
    ? await this.configurationService.getById(path)
    : await this.configurationService.getByPath(path)

    if (!page) {
      res.sendStatus(404);
    }

    res.json(page)
  }

  async index(req, res) {
    const { search } = req.query;

    if (search) {
      const pages = await this.configurationService.searchByPath(search);
      res.json(pages);
      return;
    }

    const pages = await this.configurationService.index();
    
    if (!pages) {
      res.sendStatus(404);
    }

    res.json(pages)
  }
}

module.exports = ConfigurationController;
