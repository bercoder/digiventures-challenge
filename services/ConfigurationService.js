class ConfigurationService {
	constructor(model) {
		this.model = model; //configuration page model
	}

	async index() {
		const pages = await this.model.find({});
		return pages;
	}

	async getByPath(path) {
		try {
			const page = await this.model.findOne({
				path,
			});
			return page;
		} catch (err) {
			console.log(err);
		}
	}

	async searchByPath(path) {
		const page = await this.model.find(
			{
				path: { $regex: path.toLowerCase() },
			},
			{ path: 1 }
		);

		return page;
	}
}

module.exports = ConfigurationService;
