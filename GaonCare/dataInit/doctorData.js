// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// ...existing code...
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const deployed_Db_Url = "mongodb+srv://Arun-Cluster:Arun%40123@arun-cluster0.cxukaeb.mongodb.net/?retryWrites=true&w=majority&appName=Arun-Cluster0";
const mongoose = require("mongoose");
const Doctor = require("../Models/Doctor.js");

const Doctors = [
  {
    username: "aditi.sharma",
    password: "Pass@123",
    fullName: "Dr. Aditi Sharma",
    location: "Chilkahar, Ballia",
    serviceRange: 5000,
    experience: 8,
    specialization: "Gynecology",
    email: "aditi.sharma@example.com",
    profilePhoto: "https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9jdG9yfGVufDB8fDB8fHww",
    coordinates: { lat: "25.7580", lng: "84.1205" },
    isAvailable: true
  },
  {
    username: "rohan.mehta",
    password: "Pass@123",
    fullName: "Dr. Rohan Mehta",
    location: "Rasra, Ballia",
    serviceRange: 10000,
    experience: 10,
    specialization: "Pediatrics",
    email: "rohan.mehta@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1611329828782-deb11033016b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXdlc29tZSUyMGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    coordinates: { lat: "25.8556", lng: "83.8549" },
    isAvailable: false
  },
  {
    username: "sneha.verma",
    password: "Pass@123",
    fullName: "Dr. Sneha Verma",
    location: "Tajpur, Ghazipur",
    serviceRange: 15000,
    experience: 6,
    specialization: "Dermatology",
    email: "sneha.verma@example.com",
    profilePhoto: "https://plus.unsplash.com/premium_photo-1664475543697-229156438e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF3ZXNvbWUlMjBkb2N0b3J8ZW58MHx8MHx8fDA%3D",
    coordinates: { lat: "25.6075", lng: "83.5111" },
    isAvailable: true
  },
  {
    username: "amit.khanna",
    password: "Pass@123",
    fullName: "Dr. Amit Khanna",
    location: "Tajpur Dehma, Ghazipur",
    serviceRange: 5000,
    experience: 12,
    specialization: "Orthopedics",
    email: "amit.khanna@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1645066928295-2506defde470?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGF3ZXNvbWUlMjBkb2N0b3J8ZW58MHx8MHx8fDA%3D",
    coordinates: { lat: "25.6190", lng: "83.5280" },
    isAvailable: false
  },
  {
    username: "priya.nair",
    password: "Pass@123",
    fullName: "Dr. Priya Nair",
    location: "Bansdih, Ballia",
    serviceRange: 10000,
    experience: 7,
    specialization: "Cardiology",
    email: "priya.nair@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    coordinates: { lat: "25.8850", lng: "84.0614" },
    isAvailable: true
  },
  {
    username: "vivek.singh",
    password: "Pass@123",
    fullName: "Dr. Vivek Singh",
    location: "Belthara Road, Ballia",
    serviceRange: 15000,
    experience: 9,
    specialization: "Neurology",
    email: "vivek.singh@example.com",
    profilePhoto: "https://plus.unsplash.com/premium_photo-1661757221486-183030ef8670?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    coordinates: { lat: "26.1245", lng: "83.8779" },
    isAvailable: false
  },
  {
    username: "kavita.desai",
    password: "Pass@123",
    fullName: "Dr. Kavita Desai",
    location: "Dubhar, Ballia",
    serviceRange: 5000,
    experience: 11,
    specialization: "Ophthalmology",
    email: "kavita.desai@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1595543848721-7b5dd3e03168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdvb2Rsb29rJTIwZG9jdG9yfGVufDB8fDB8fHww",
    coordinates: { lat: "25.7990", lng: "84.1090" },
    isAvailable: true
  },
  {
    username: "rajesh.malhotra",
    password: "Pass@123",
    fullName: "Dr. Rajesh Malhotra",
    location: "Reoti, Ballia",
    serviceRange: 10000,
    experience: 15,
    specialization: "ENT",
    email: "rajesh.malhotra@example.com",
    profilePhoto: "https://plus.unsplash.com/premium_photo-1661778976948-0cbf766dc0e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJlYXV0aWZ1bCUyMGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    coordinates: { lat: "25.8443", lng: "84.3778" },
    isAvailable: false
  },
  {
    username: "shreya.kapoor",
    password: "Pass@123",
    fullName: "Dr. Shreya Kapoor",
    location: "Siuri, Ballia",
    serviceRange: 15000,
    experience: 5,
    specialization: "Psychiatry",
    email: "shreya.kapoor@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG9jdG9yfGVufDB8fDB8fHww",
    coordinates: { lat: "25.7910", lng: "84.2150" },
    isAvailable: true
  },
  {
    username: "arjun.reddy",
    password: "Pass@123",
    fullName: "Dr. Arjun Reddy",
    location: "Manihari, Ballia",
    serviceRange: 5000,
    experience: 14,
    specialization: "General Surgery",
    email: "arjun.reddy@example.com",
    profilePhoto: "https://plus.unsplash.com/premium_photo-1677165481551-c91ed6e15f09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGdvb2Rsb29rJTIwZG9jdG9yfGVufDB8fDB8fHww",
    coordinates: { lat: "25.8330", lng: "84.1400" },
    isAvailable: false
  },
  {
    username: "neha.pandey",
    password: "Pass@123",
    fullName: "Dr. Neha Pandey",
    location: "Chilkahar, Ballia",
    serviceRange: 7000,
    experience: 4,
    specialization: "Family Medicine",
    email: "neha.pandey@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.7600", lng: "84.1210" },
    isAvailable: true
  },
  {
    username: "saurabh.patel",
    password: "Pass@123",
    fullName: "Dr. Saurabh Patel",
    location: "Rasra, Ballia",
    serviceRange: 8000,
    experience: 13,
    specialization: "Urology",
    email: "saurabh.patel@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1580281657524-2fbf2d3b8f6b?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8560", lng: "83.8555" },
    isAvailable: false
  },
  {
    username: "megha.singh",
    password: "Pass@123",
    fullName: "Dr. Megha Singh",
    location: "Tajpur, Ghazipur",
    serviceRange: 6000,
    experience: 3,
    specialization: "ENT",
    email: "megha.singh@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.6080", lng: "83.5120" },
    isAvailable: true
  },
  {
    username: "kiran.jain",
    password: "Pass@123",
    fullName: "Dr. Kiran Jain",
    location: "Bansdih, Ballia",
    serviceRange: 12000,
    experience: 20,
    specialization: "Oncology",
    email: "kiran.jain@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8860", lng: "84.0620" },
    isAvailable: false
  },
  {
    username: "rahul.verma",
    password: "Pass@123",
    fullName: "Dr. Rahul Verma",
    location: "Belthara Road, Ballia",
    serviceRange: 9000,
    experience: 6,
    specialization: "Pulmonology",
    email: "rahul.verma@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "26.1250", lng: "83.8785" },
    isAvailable: true
  },
  {
    username: "sudha.gupta",
    password: "Pass@123",
    fullName: "Dr. Sudha Gupta",
    location: "Dubhar, Ballia",
    serviceRange: 4000,
    experience: 18,
    specialization: "Gynecology",
    email: "sudha.gupta@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.7985", lng: "84.1085" },
    isAvailable: false
  },
  {
    username: "mukul.kumar",
    password: "Pass@123",
    fullName: "Dr. Mukul Kumar",
    location: "Reoti, Ballia",
    serviceRange: 11000,
    experience: 11,
    specialization: "Nephrology",
    email: "mukul.kumar@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8435", lng: "84.3790" },
    isAvailable: true
  },
  {
    username: "tanvi.agarwal",
    password: "Pass@123",
    fullName: "Dr. Tanvi Agarwal",
    location: "Siuri, Ballia",
    serviceRange: 5000,
    experience: 2,
    specialization: "Pediatrics",
    email: "tanvi.agarwal@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1580281657524-2fbf2d3b8f6b?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.7920", lng: "84.2160" },
    isAvailable: false
  },
  {
    username: "vikas.sharma",
    password: "Pass@123",
    fullName: "Dr. Vikas Sharma",
    location: "Manihari, Ballia",
    serviceRange: 7000,
    experience: 9,
    specialization: "General Medicine",
    email: "vikas.sharma@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8335", lng: "84.1410" },
    isAvailable: true
  },
  {
    username: "kriti.pandey",
    password: "Pass@123",
    fullName: "Dr. Kriti Pandey",
    location: "Chilkahar, Ballia",
    serviceRange: 6000,
    experience: 5,
    specialization: "Dermatology",
    email: "kriti.pandey@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.7570", lng: "84.1190" },
    isAvailable: false
  },
  {
    username: "sanjeev.kumar",
    password: "Pass@123",
    fullName: "Dr. Sanjeev Kumar",
    location: "Rasra, Ballia",
    serviceRange: 8500,
    experience: 16,
    specialization: "Cardiology",
    email: "sanjeev.kumar@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1595543848721-7b5dd3e03168?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8570", lng: "83.8540" },
    isAvailable: true
  },
  {
    username: "pooja.patel",
    password: "Pass@123",
    fullName: "Dr. Pooja Patel",
    location: "Tajpur, Ghazipur",
    serviceRange: 9500,
    experience: 8,
    specialization: "Endocrinology",
    email: "pooja.patel@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1580281657524-2fbf2d3b8f6b?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.6065", lng: "83.5105" },
    isAvailable: false
  },
  {
    username: "anish.rao",
    password: "Pass@123",
    fullName: "Dr. Anish Rao",
    location: "Bansdih, Ballia",
    serviceRange: 7000,
    experience: 4,
    specialization: "Psychiatry",
    email: "anish.rao@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8870", lng: "84.0600" },
    isAvailable: true
  },
  {
    username: "rekha.singh",
    password: "Pass@123",
    fullName: "Dr. Rekha Singh",
    location: "Belthara Road, Ballia",
    serviceRange: 10000,
    experience: 13,
    specialization: "Ophthalmology",
    email: "rekha.singh@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1595543848721-7b5dd3e03168?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "26.1240", lng: "83.8780" },
    isAvailable: false
  },
  {
    username: "abhishek.tiwari",
    password: "Pass@123",
    fullName: "Dr. Abhishek Tiwari",
    location: "Dubhar, Ballia",
    serviceRange: 4500,
    experience: 7,
    specialization: "ENT",
    email: "abhishek.tiwari@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.7995", lng: "84.1095" },
    isAvailable: true
  },
  {
    username: "neeraj.kapoor",
    password: "Pass@123",
    fullName: "Dr. Neeraj Kapoor",
    location: "Reoti, Ballia",
    serviceRange: 13000,
    experience: 19,
    specialization: "Orthopedics",
    email: "neeraj.kapoor@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1677165481551-c91ed6e15f09?w=600&auto=format&fit=crop&q=60",
    coordinates: { lat: "25.8450", lng: "84.3785" },
    isAvailable: false
  }
];

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(deployed_Db_Url);
}

const initDB = async () => {
  // use with caution: uncomment if you want to clear existing collection
  // await Doctor.deleteMany({});
  await Doctor.insertMany(Doctors);
  const data = await Doctor.find({});
  console.log("Inserted doctors:", data.length);
  // console.log(data);
  console.log("data was initialized");
};

initDB();
// ...existing code...