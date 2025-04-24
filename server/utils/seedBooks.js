const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config();

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
    genre: ["Fiction", "Classic", "Literary Fiction"],
    publishedYear: 1925,
    isbn: "978-0743273565",
    averageRating: 4.5,
    totalReviews: 12
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The story of young Scout Finch and her father Atticus, a lawyer who defends a black man accused of a terrible crime in the American South of the 1930s.",
    coverImage: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
    genre: ["Fiction", "Classic", "Historical Fiction"],
    publishedYear: 1960,
    isbn: "978-0446310789",
    averageRating: 4.8,
    totalReviews: 15
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel set in a totalitarian society where critical thinking is suppressed under a regime of surveillance and control.",
    coverImage: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
    genre: ["Fiction", "Dystopian", "Science Fiction"],
    publishedYear: 1949,
    isbn: "978-0451524935",
    averageRating: 4.7,
    totalReviews: 18
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "The adventure of Bilbo Baggins, a hobbit who embarks on an unexpected journey with a group of dwarves to reclaim their mountain home from a dragon.",
    coverImage: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
    genre: ["Fiction", "Fantasy", "Adventure"],
    publishedYear: 1937,
    isbn: "978-0547928227",
    averageRating: 4.6,
    totalReviews: 20
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "The story follows Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of early 19th-century England.",
    coverImage: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
    genre: ["Fiction", "Classic", "Romance"],
    publishedYear: 1813,
    isbn: "978-0141439518",
    averageRating: 4.4,
    totalReviews: 14
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A lone astronaut must save humanity from extinction in this gripping interstellar adventure that combines hard science with heart-pounding suspense.",
    coverImage: "https://m.media-amazon.com/images/I/91-+2YhGH5L._AC_UF1000,1000_QL80_.jpg",
    genre: ["Science Fiction", "Adventure", "Contemporary"],
    publishedYear: 2021,
    isbn: "978-0593135204",
    averageRating: 4.9,
    totalReviews: 25
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description: "An aging Hollywood starlet finally tells the truth about her scandalous life to an unknown journalist, revealing a tale of ambition, unexpected friendship, and forbidden love.",
    coverImage: "https://m.media-amazon.com/images/I/71pNGYOPP5L._AC_UF1000,1000_QL80_.jpg",
    genre: ["Historical Fiction", "Romance", "Contemporary"],
    publishedYear: 2017,
    isbn: "978-1501161933",
    averageRating: 4.7,
    totalReviews: 22
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "A revolutionary guide to using tiny changes to transform your habits, offering a proven framework for daily improvement.",
    coverImage: "https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg",
    genre: ["Non-Fiction", "Self-Help", "Psychology"],
    publishedYear: 2018,
    isbn: "978-0735211292",
    averageRating: 4.8,
    totalReviews: 30
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library containing infinite books, each telling the story of another reality. One tells the story of your life as it is, along with others for the lives you could have lived.",
    coverImage: "https://m.media-amazon.com/images/I/81tCtHFtOgL._AC_UF1000,1000_QL80_.jpg",
    genre: ["Fiction", "Fantasy", "Contemporary"],
    publishedYear: 2020,
    isbn: "978-0525559474",
    averageRating: 4.5,
    totalReviews: 28
  },
  {
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    coverImage: "https://m.media-amazon.com/images/I/81NwOj14S6L._AC_UF1000,1000_QL80_.jpg",
    genre: ["Non-Fiction", "Memoir", "Biography"],
    publishedYear: 2018,
    isbn: "978-0399590504",
    averageRating: 4.7,
    totalReviews: 24
  }
];

const seedBooks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book-review-platform', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('Connected to MongoDB...');

    // Delete existing books
    await Book.deleteMany({});
    console.log('Existing books deleted...');

    // Insert sample books
    const books = await Book.insertMany(sampleBooks);
    console.log('Sample books inserted:', books.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedBooks(); 