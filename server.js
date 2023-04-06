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

app.use(morgan("dev"));

// mongoose and mongo sandbox routes
app.get("/add-blog", (req, res) => {
	const blog = new Blog({
		title:
			"Is Mercedes competing with Red Bull only track specific & Australian GP Thoughts",
		snippet: "Lewis Hamilton's podium finish was Mercedes first...",
		body: "Despite the red flag controversy at the Australian Grand Prix at the weekend, Mercedes managed to finish with one car in the top 3. Apart from pitting George Russell before the red flag and an engine failure shortly after, it was a good performance from Mercedes this weekend. However, was this a Mercedes performance that demonstrates their improvements to a struggling car this season, or was this just a Mercedes that revelled in perfect track and weather conditions that allowed the team to set-up the cars at a sweet spot that only this circuit, and others similar can offer? For now I believe it would be the later, and what proved to me just how strong this year's Red Bull is, is the fact that despite this track not suiting the Red Bulls, they still managed to comfortable take the win with Max Verstappen. It's scary just how strong this car is this season. In an alternate universe, and without any red flags and without an engine bursting into flames, George Russell would've had an amazing weekend. Possibly following Max closer and longer, and probably beating Lewis for second. Three races in and George has out-qualified Lewis on all three occassions, a tremendous feet in only his second season in the silver(black) arrows. What interests me most, however, is George's confidence on the radio and his assersion in telling the team what he wants, and more often than not, getting his stratergies spot-on. If you were new to watching Formula 1, and had no idea of Lewis's prolific title winning history, it would be absolutely justified to think George was the number one driver at Mercedes. Lewis, in my opinion, can often be reluctant to make a decision on the radio, instead waiting for his engieer to make a call so as not to take the blame incase the strategy is a wrong one. A harsh judgement on a seven time world champion I know, but like I said, that is an opinion I hold based on his pairing with George, and it will be intersting to see how that relationship developes over the season. And that's not all I'm looking forward to keeping an eye on this season. I don't think you quite need to be Nostradamous to predict this years champion, but it doesn't mean that this season is already over. Along with Mercedes, there is also the intrigue of how Ferrari will improve their car (and luck) this season. Will Leclerc, who has all the ingredients to be a future world champion, be happy staying at a team that is dropping further back down the grid? Will Lando Norris be content battling to get that difficult McLaren into Q1? Will Alonso finally be on the top step of the podium this season, and can Aston Martin keep sticking that car on the podium? There's so much to be excited for this season.",
	});

	blog
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.error(err));
});

app.get("/all-blogs", (req, res) => {
	Blog.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

app.get("/single-blog", (req, res) => {
	Blog.findById("642e1ab4db43edc8d1a0b004")
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.error(err));
});

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

app.get("/about", (req, res) => {
	res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
	res.render("create", { title: "Create a New Blog" });
});

// 404 page
app.use((req, res) => {
	res.status(404).render("404", { title: "404" });
});
