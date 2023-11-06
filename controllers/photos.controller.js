const Photo = require('../models/photo.model')

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
	try {
		const escape = function (html) {
			return html
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;')
		}

		let { title, author, email } = req.fields
		title = escape(title)
		author = escape(author)
		email = escape(email)
		const file = req.files.file
		const allowedExt = []
		const ext = file.path.split('.').slice(-1)[0]
		const isExtAllowed = allowedExt.includes(ext)

		if (title && author && email && file && isExtAllowed && author.length <= 50 && title.length <= 25) {
			// if fields are not empty, extension allowed, title and author not too long

			const fileName = file.path.split('/').slice(-1)[0] // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
			const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 })
			await newPhoto.save() // ...save new photo in DB
			res.json(newPhoto)
		} else {
			throw new Error('Wrong input!')
		}
	} catch (err) {
		res.status(500).json(err)
	}
}

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {
	try {
		res.json(await Photo.find())
	} catch (err) {
		res.status(500).json(err)
	}
}

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
	try {
		const photoToUpdate = await Photo.findOne({ _id: req.params.id })
		if (!photoToUpdate) res.status(404).json({ message: 'Not found' })
		else {
			photoToUpdate.votes++
			photoToUpdate.save()
			res.send({ message: 'OK' })
		}
	} catch (err) {
		res.status(500).json(err)
	}
}
