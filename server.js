const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

const app = express();
const PORT = 8080;

// connect to mongodb
const dbURI =
	"mongodb+srv://dave:dave1234@nodetuts.hm8339p.mongodb.net/node-tuts?retryWrites=true&w=majority";

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) =>
		app.listen(PORT, () => {
			console.log(`Server running on port: ${PORT}`);
		})
	)
	.catch((err) => console.error(err));

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
	res.redirect("/blogs");
});

// blog routes
app.get("/blogs", (req, res) => {
	Blog.find()
		.sort({ createdAt: -1 })
		.then((result) => {
			res.render("index", { title: "All Blogs", blogs: result });
		})
		.catch((err) => console.error(err));
});

app.post("/blogs", (req, res) => {
	const blog = new Blog(req.body);
	blog
		.save()
		.then((result) => {
			res.redirect("/blogs");
		})
		.catch((err) => console.error(err));
});

app.get("/about", (req, res) => {
	res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
	res.render("create", { title: "Create a New Blog" });
});

app.get("/blogs/:id", (req, res) => {
	const id = req.params.id;
	Blog.findById(id)
		.then((result) => {
			res.render("details", { blog: result, title: "Blog Details" });
		})
		.catch((err) => console.error(err));
});

app.delete("/blogs/:id", (req, res) => {
	const id = req.params.id;

	Blog.findByIdAndDelete(id)
		.then((result) => {
			res.json({ redirect: "/blogs" });
		})
		.catch((err) => console.error(err));
});

// 404 page
app.use((req, res) => {
	res.status(404).render("404", { title: "404" });
});
