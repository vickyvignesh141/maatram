import React, { useState, useEffect } from "react";
import Admintop from "../../nav/admintop";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Users,
  UserPlus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";

const AdminMentorAssignments = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [assignmentMode, setAssignmentMode] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [expandedMentor, setExpandedMentor] = useState(null);
  const [mentorFilter, setMentorFilter] = useState("all");
  const itemsPerPage = 10;

  // Updated mentors data with increased capacity to 25
  const initialMentors = [
    { 
      id: 1, 
      name: "Dr. Esakki Rajan", 
      mentorId: "MAA100002", 
      email: "esakki@example.com",
      maxStudents: 25,
      currentStudents: 8,
      students: [
        { id: 1, name: "Gomagan", studentId: "MAA242626", college: "Velammal Engineering College" },
        { id: 2, name: "Arun Kumar", studentId: "MAA242811", college: "St. Joseph College of Engineering" },
        { id: 101, name: "Priya Sharma", studentId: "MAA245101", college: "Anna University" },
        { id: 102, name: "Rohit Verma", studentId: "MAA245102", college: "SRM Institute of Science and Technology" },
        { id: 103, name: "Sneha Patel", studentId: "MAA245103", college: "VIT Vellore" },
        { id: 104, name: "Amit Singh", studentId: "MAA245104", college: "IIT Madras" },
        { id: 105, name: "Neha Gupta", studentId: "MAA245105", college: "NIT Trichy" },
        { id: 106, name: "Rajesh Kumar", studentId: "MAA245106", college: "PSG College of Technology" }
      ]
    },
    { 
      id: 2, 
      name: "Prof. Kaviya Sharma", 
      mentorId: "MAA100008", 
      email: "kaviya@example.com",
      maxStudents: 25,
      currentStudents: 12,
      students: [
        { id: 3, name: "Rahul Sharma", studentId: "MAA234216", college: "Sri Sairam Engineering College" },
        { id: 107, name: "Anjali Mehta", studentId: "MAA245107", college: "Amrita Vishwa Vidyapeetham" },
        { id: 108, name: "Vikram Singh", studentId: "MAA245108", college: "BITS Pilani" },
        { id: 109, name: "Pooja Reddy", studentId: "MAA245109", college: "Christ University" },
        { id: 110, name: "Karthik Nair", studentId: "MAA245110", college: "Manipal Institute of Technology" },
        { id: 111, name: "Divya Iyer", studentId: "MAA245111", college: "Loyola College" },
        { id: 112, name: "Sanjay Menon", studentId: "MAA245112", college: "Cochin University of Science and Technology" },
        { id: 113, name: "Meera Krishnan", studentId: "MAA245113", college: "University of Hyderabad" },
        { id: 114, name: "Deepak Joshi", studentId: "MAA245114", college: "IIT Bombay" },
        { id: 115, name: "Swati Desai", studentId: "MAA245115", college: "NIT Warangal" },
        { id: 116, name: "Ravi Teja", studentId: "MAA245116", college: "JNTU Hyderabad" },
        { id: 117, name: "Suresh Babu", studentId: "MAA245117", college: "Andhra University" }
      ]
    },
    { 
      id: 3, 
      name: "Dr. Praveen Kumar", 
      mentorId: "MAA100005", 
      email: "praveen@example.com",
      maxStudents: 25,
      currentStudents: 5,
      students: [
        { id: 118, name: "Lakshmi Narayanan", studentId: "MAA245118", college: "SASTRA University" },
        { id: 119, name: "Harish Kumar", studentId: "MAA245119", college: "Thapar Institute of Engineering and Technology" },
        { id: 120, name: "Preethi Sundar", studentId: "MAA245120", college: "Kumaraguru College of Technology" },
        { id: 121, name: "Mohan Raj", studentId: "MAA245121", college: "Sathyabama Institute of Science and Technology" },
        { id: 122, name: "Geetha Rani", studentId: "MAA245122", college: "Karunya Institute of Technology and Sciences" }
      ]
    },
    { 
      id: 4, 
      name: "Prof. Vignesh Iyer", 
      mentorId: "MAA100003", 
      email: "vignesh@example.com",
      maxStudents: 25,
      currentStudents: 15,
      students: [
        { id: 4, name: "Sneha Reddy", studentId: "MAA228523", college: "Sathyabama Institute of Science and Technology" },
        { id: 123, name: "Arvind Swamy", studentId: "MAA245123", college: "Vellore Institute of Technology" },
        { id: 124, name: "Kavitha Srinivasan", studentId: "MAA245124", college: "Amrita School of Engineering" },
        { id: 125, name: "Rajiv Menon", studentId: "MAA245125", college: "PSG College of Arts & Science" },
        { id: 126, name: "Anitha Kumar", studentId: "MAA245126", college: "Madras Christian College" },
        { id: 127, name: "Suresh Kumar", studentId: "MAA245127", college: "St. Joseph's College of Engineering" },
        { id: 128, name: "Divya Prakash", studentId: "MAA245128", college: "Rajalakshmi Engineering College" },
        { id: 129, name: "Rohit Sharma", studentId: "MAA245129", college: "SRM Easwari Engineering College" },
        { id: 130, name: "Priya Das", studentId: "MAA245130", college: "Jeppiaar Engineering College" },
        { id: 131, name: "Vijay Antony", studentId: "MAA245131", college: "Panimalar Engineering College" },
        { id: 132, name: "Shweta Gupta", studentId: "MAA245132", college: "RMK Engineering College" },
        { id: 133, name: "Arjun Reddy", studentId: "MAA245133", college: "Guru Nanak College" },
        { id: 134, name: "Meenakshi Sundaram", studentId: "MAA245134", college: "KCG College of Technology" },
        { id: 135, name: "Balaji Srinivasan", studentId: "MAA245135", college: "RMD Engineering College" },
        { id: 136, name: "Deepika Padukone", studentId: "MAA245136", college: "Stella Maris College" }
      ]
    },
    { 
      id: 5, 
      name: "Dr. Logeshwaran", 
      mentorId: "MAA100012", 
      email: "logesh@example.com",
      maxStudents: 25,
      currentStudents: 20,
      students: [
        { id: 5, name: "Vikram Singh", studentId: "MAA231627", college: "Kumaraguru College of Technology" },
        { id: 137, name: "Aravind Krishnan", studentId: "MAA245137", college: "Coimbatore Institute of Technology" },
        { id: 138, name: "Shalini Venkat", studentId: "MAA245138", college: "Government College of Technology" },
        { id: 139, name: "Ramesh Kumar", studentId: "MAA245139", college: "Anna University Regional Campus" },
        { id: 140, name: "Pavithra S", studentId: "MAA245140", college: "Kongu Engineering College" },
        { id: 141, name: "Sundar Raj", studentId: "MAA245141", college: "Sri Krishna College of Technology" },
        { id: 142, name: "Anandhi M", studentId: "MAA245142", college: "Karpagam College of Engineering" },
        { id: 143, name: "Murali Krishna", studentId: "MAA245143", college: "Vel Tech Engineering College" },
        { id: 144, name: "Lakshmi Priya", studentId: "MAA245144", college: "SRM Valliammai Engineering College" },
        { id: 145, name: "Rajendra Prasad", studentId: "MAA245145", college: "Jaya Engineering College" },
        { id: 146, name: "Swetha Reddy", studentId: "MAA245146", college: "Muthayammal Engineering College" },
        { id: 147, name: "Krishna Kumar", studentId: "MAA245147", college: "Dhanalakshmi Srinivasan Engineering College" },
        { id: 148, name: "Priyanka S", studentId: "MAA245148", college: "SNS College of Technology" },
        { id: 149, name: "Harishankar", studentId: "MAA245149", college: "Info Institute of Engineering" },
        { id: 150, name: "Nandhini R", studentId: "MAA245150", college: "Park College of Engineering" },
        { id: 151, name: "Saravanan K", studentId: "MAA245151", college: "Sri Ramakrishna Engineering College" },
        { id: 152, name: "Vasanthi P", studentId: "MAA245152", college: "VSB Engineering College" },
        { id: 153, name: "Manoj Kumar", studentId: "MAA245153", college: "RVS College of Engineering" },
        { id: 154, name: "Jaya Lakshmi", studentId: "MAA245154", college: "SSM Institute of Engineering and Technology" },
        { id: 155, name: "Senthil Kumar", studentId: "MAA245155", college: "Excel Engineering College" }
      ]
    },
    { 
      id: 6, 
      name: "Prof. Narmatha Devi", 
      mentorId: "MAA100004", 
      email: "narmatha@example.com",
      maxStudents: 25,
      currentStudents: 3,
      students: [
        { id: 156, name: "Gokul Anand", studentId: "MAA245156", college: "Jerusalem College of Engineering" },
        { id: 157, name: "Shruthi S", studentId: "MAA245157", college: "Prince Shri Venkateshwara Padmavathy Engineering College" },
        { id: 158, name: "Vijayakumar R", studentId: "MAA245158", college: "Agni College of Technology" }
      ]
    },
    { 
      id: 7, 
      name: "Dr. Suresh Babu", 
      mentorId: "MAA100007", 
      email: "suresh@example.com",
      maxStudents: 25,
      currentStudents: 18,
      students: [
        { id: 159, name: "Akhil Kumar", studentId: "MAA245159", college: "Hindustan Institute of Technology and Science" },
        { id: 160, name: "Nisha Rani", studentId: "MAA245160", college: "Rajiv Gandhi College of Engineering" },
        { id: 161, name: "Prakash Raj", studentId: "MAA245161", college: "Panimalar Institute of Technology" },
        { id: 162, name: "Sandhya R", studentId: "MAA245162", college: "Meenakshi Sundararajan Engineering College" },
        { id: 163, name: "Venkatesh P", studentId: "MAA245163", college: "Sri Venkateswara College of Engineering" },
        { id: 164, name: "Bhuvana S", studentId: "MAA245164", college: "Saveetha Engineering College" },
        { id: 165, name: "Madhan Kumar", studentId: "MAA245165", college: "Adhi College of Engineering and Technology" },
        { id: 166, name: "Sowmya K", studentId: "MAA245166", college: "Easwari Engineering College" },
        { id: 167, name: "Kiran Kumar", studentId: "MAA245167", college: "Raja College of Engineering and Technology" },
        { id: 168, name: "Anuradha M", studentId: "MAA245168", college: "St. Peter's College of Engineering and Technology" },
        { id: 169, name: "Sathish Kumar", studentId: "MAA245169", college: "Jeppiaar SRR Engineering College" },
        { id: 170, name: "Pavithra Devi", studentId: "MAA245170", college: "Aarupadai Veedu Institute of Technology" },
        { id: 171, name: "Raghavan S", studentId: "MAA245171", college: "Sri Sairam Engineering College" },
        { id: 172, name: "Divya Bharathi", studentId: "MAA245172", college: "Velammal Engineering College" },
        { id: 173, name: "Mohan Das", studentId: "MAA245173", college: "Sri Muthukumaran Institute of Technology" },
        { id: 174, name: "Lakshmi Kanth", studentId: "MAA245174", college: "T.J. Institute of Technology" },
        { id: 175, name: "Saranya M", studentId: "MAA245175", college: "Dr. M.G.R. Educational and Research Institute" },
        { id: 176, name: "Karthick Raja", studentId: "MAA245176", college: "Prathyusha Engineering College" }
      ]
    },
    { 
      id: 8, 
      name: "Prof. Meenakshi Sundaram", 
      mentorId: "MAA100009", 
      email: "meenakshi@example.com",
      maxStudents: 25,
      currentStudents: 25,
      students: Array.from({length: 25}, (_, i) => ({
        id: 200 + i,
        name: `Student ${i+1}`,
        studentId: `MAA24${2000 + i}`,
        college: `College ${String.fromCharCode(65 + (i % 26))} University`
      }))
    },
    { 
      id: 9, 
      name: "Dr. Rajesh Kumar", 
      mentorId: "MAA100010", 
      email: "rajesh@example.com",
      maxStudents: 25,
      currentStudents: 10,
      students: Array.from({length: 10}, (_, i) => ({
        id: 225 + i,
        name: `Rajesh Student ${i+1}`,
        studentId: `MAA24${2250 + i}`,
        college: `University of Technology ${i+1}`
      }))
    },
    { 
      id: 10, 
      name: "Prof. Anjali Sharma", 
      mentorId: "MAA100011", 
      email: "anjali@example.com",
      maxStudents: 25,
      currentStudents: 0,
      students: []
    }
  ];

  // Updated allStudents data with 100+ students
  const allStudents = [
    // Original students
    { id: 6, name: "Anjali Mehta", studentId: "MAA242618", college: "JJ College of Engineering" },
    { id: 7, name: "Kiran Reddy", studentId: "MAA271537", college: "Loyola College" },
    { id: 8, name: "Divya Iyer", studentId: "MAA213456", college: "Ramakrishna College of Engineering" },
    { id: 9, name: "Rohit Verma", studentId: "MAA263748", college: "SRM Institute of Science and Technology" },
    { id: 10, name: "Pooja Singh", studentId: "MAA234531", college: "VIT Vellore" },
    { id: 11, name: "Sudharsan Kumar", studentId: "MAA283541", college: "CIT College of Engineering" },
    { id: 12, name: "Balaji S", studentId: "MAA241325", college: "Karpagam College of Engineering" },
    { id: 13, name: "Rajesh Menon", studentId: "MAA253647", college: "JNN College of Engineering" },
    { id: 14, name: "Meera Krishnan", studentId: "MAA231498", college: "NIT Trichy" },
    { id: 15, name: "Sanjay Kumar", studentId: "MAA263896", college: "RMK Engineering College" },
    { id: 16, name: "Dinesh R", studentId: "MAA263541", college: "Velammal Engineering College" },
    { id: 17, name: "Deepak Sharma", studentId: "MAA283514", college: "NIT Warangal" },
    { id: 18, name: "Sugan Kumar", studentId: "MAA243986", college: "Jeppiaar Engineering College" },
    { id: 19, name: "Kaviya S", studentId: "MAA226658", college: "MIT College of Engineering" },
    { id: 20, name: "Visali R", studentId: "MAA246846", college: "Sairam Engineering College" },
    
    // Additional 85 students
    { id: 21, name: "Aarav Sharma", studentId: "MAA240001", college: "IIT Delhi" },
    { id: 22, name: "Vihaan Gupta", studentId: "MAA240002", college: "IIT Bombay" },
    { id: 23, name: "Aditya Singh", studentId: "MAA240003", college: "IIT Kanpur" },
    { id: 24, name: "Vivaan Kumar", studentId: "MAA240004", college: "IIT Kharagpur" },
    { id: 25, name: "Arjun Patel", studentId: "MAA240005", college: "IIT Roorkee" },
    { id: 26, name: "Sai Reddy", studentId: "MAA240006", college: "IIT Guwahati" },
    { id: 27, name: "Mohammed Ali", studentId: "MAA240007", college: "IIT Hyderabad" },
    { id: 28, name: "Krishna Das", studentId: "MAA240008", college: "IIT Madras" },
    { id: 29, name: "Aryan Mishra", studentId: "MAA240009", college: "NIT Surathkal" },
    { id: 30, name: "Reyansh Joshi", studentId: "MAA240010", college: "NIT Calicut" },
    { id: 31, name: "Ananya Singh", studentId: "MAA240011", college: "NIT Rourkela" },
    { id: 32, name: "Diya Patel", studentId: "MAA240012", college: "NIT Allahabad" },
    { id: 33, name: "Aadhya Kumar", studentId: "MAA240013", college: "NIT Jamshedpur" },
    { id: 34, name: "Advika Sharma", studentId: "MAA240014", college: "NIT Nagpur" },
    { id: 35, name: "Prisha Gupta", studentId: "MAA240015", college: "NIT Kurukshetra" },
    { id: 36, name: "Ishaan Reddy", studentId: "MAA240016", college: "BITS Pilani" },
    { id: 37, name: "Kabir Singh", studentId: "MAA240017", college: "BITS Hyderabad" },
    { id: 38, name: "Aarohi Patel", studentId: "MAA240018", college: "BITS Goa" },
    { id: 39, name: "Vihaan Kumar", studentId: "MAA240019", college: "DTU Delhi" },
    { id: 40, name: "Ayaan Sharma", studentId: "MAA240020", college: "NSIT Delhi" },
    { id: 41, name: "Kiaan Gupta", studentId: "MAA240021", college: "Jadavpur University" },
    { id: 42, name: "Rudra Singh", studentId: "MAA240022", college: "University of Calcutta" },
    { id: 43, name: "Arnav Patel", studentId: "MAA240023", college: "University of Mumbai" },
    { id: 44, name: "Yuvaan Kumar", studentId: "MAA240024", college: "University of Delhi" },
    { id: 45, name: "Shaurya Reddy", studentId: "MAA240025", college: "University of Hyderabad" },
    { id: 46, name: "Atharva Sharma", studentId: "MAA240026", college: "University of Pune" },
    { id: 47, name: "Parth Gupta", studentId: "MAA240027", college: "Anna University" },
    { id: 48, name: "Vivaan Singh", studentId: "MAA240028", college: "JNTU Hyderabad" },
    { id: 49, name: "Reyansh Patel", studentId: "MAA240029", college: "Osmania University" },
    { id: 50, name: "Mohammed Kumar", studentId: "MAA240030", college: "University of Madras" },
    { id: 51, name: "Ansh Reddy", studentId: "MAA240031", college: "Guru Gobind Singh Indraprastha University" },
    { id: 52, name: "Myra Sharma", studentId: "MAA240032", college: "Banaras Hindu University" },
    { id: 53, name: "Sara Gupta", studentId: "MAA240033", college: "Aligarh Muslim University" },
    { id: 54, name: "Aarav Singh", studentId: "MAA240034", college: "University of Kerala" },
    { id: 55, name: "Vihaan Patel", studentId: "MAA240035", college: "University of Rajasthan" },
    { id: 56, name: "Aditya Kumar", studentId: "MAA240036", college: "University of Mysore" },
    { id: 57, name: "Vivaan Reddy", studentId: "MAA240037", college: "University of Calcutta" },
    { id: 58, name: "Arjun Sharma", studentId: "MAA240038", college: "University of Mumbai" },
    { id: 59, name: "Sai Gupta", studentId: "MAA240039", college: "University of Delhi" },
    { id: 60, name: "Mohammed Singh", studentId: "MAA240040", college: "University of Hyderabad" },
    { id: 61, name: "Krishna Patel", studentId: "MAA240041", college: "University of Pune" },
    { id: 62, name: "Aryan Kumar", studentId: "MAA240042", college: "Anna University" },
    { id: 63, name: "Reyansh Reddy", studentId: "MAA240043", college: "JNTU Hyderabad" },
    { id: 64, name: "Ananya Sharma", studentId: "MAA240044", college: "Osmania University" },
    { id: 65, name: "Diya Gupta", studentId: "MAA240045", college: "University of Madras" },
    { id: 66, name: "Aadhya Singh", studentId: "MAA240046", college: "Guru Gobind Singh Indraprastha University" },
    { id: 67, name: "Advika Patel", studentId: "MAA240047", college: "Banaras Hindu University" },
    { id: 68, name: "Prisha Kumar", studentId: "MAA240048", college: "Aligarh Muslim University" },
    { id: 69, name: "Ishaan Reddy", studentId: "MAA240049", college: "University of Kerala" },
    { id: 70, name: "Kabir Sharma", studentId: "MAA240050", college: "University of Rajasthan" },
    { id: 71, name: "Aarohi Gupta", studentId: "MAA240051", college: "University of Mysore" },
    { id: 72, name: "Vihaan Singh", studentId: "MAA240052", college: "University of Calcutta" },
    { id: 73, name: "Ayaan Patel", studentId: "MAA240053", college: "University of Mumbai" },
    { id: 74, name: "Kiaan Kumar", studentId: "MAA240054", college: "University of Delhi" },
    { id: 75, name: "Rudra Reddy", studentId: "MAA240055", college: "University of Hyderabad" },
    { id: 76, name: "Arnav Sharma", studentId: "MAA240056", college: "University of Pune" },
    { id: 77, name: "Yuvaan Gupta", studentId: "MAA240057", college: "Anna University" },
    { id: 78, name: "Shaurya Singh", studentId: "MAA240058", college: "JNTU Hyderabad" },
    { id: 79, name: "Atharva Patel", studentId: "MAA240059", college: "Osmania University" },
    { id: 80, name: "Parth Kumar", studentId: "MAA240060", college: "University of Madras" },
    { id: 81, name: "Vivaan Reddy", studentId: "MAA240061", college: "Guru Gobind Singh Indraprastha University" },
    { id: 82, name: "Reyansh Sharma", studentId: "MAA240062", college: "Banaras Hindu University" },
    { id: 83, name: "Mohammed Gupta", studentId: "MAA240063", college: "Aligarh Muslim University" },
    { id: 84, name: "Ansh Singh", studentId: "MAA240064", college: "University of Kerala" },
    { id: 85, name: "Myra Patel", studentId: "MAA240065", college: "University of Rajasthan" },
    { id: 86, name: "Sara Kumar", studentId: "MAA240066", college: "University of Mysore" },
    { id: 87, name: "Aarav Reddy", studentId: "MAA240067", college: "University of Calcutta" },
    { id: 88, name: "Vihaan Sharma", studentId: "MAA240068", college: "University of Mumbai" },
    { id: 89, name: "Aditya Gupta", studentId: "MAA240069", college: "University of Delhi" },
    { id: 90, name: "Vivaan Singh", studentId: "MAA240070", college: "University of Hyderabad" },
    { id: 91, name: "Arjun Patel", studentId: "MAA240071", college: "University of Pune" },
    { id: 92, name: "Sai Kumar", studentId: "MAA240072", college: "Anna University" },
    { id: 93, name: "Mohammed Reddy", studentId: "MAA240073", college: "JNTU Hyderabad" },
    { id: 94, name: "Krishna Sharma", studentId: "MAA240074", college: "Osmania University" },
    { id: 95, name: "Aryan Gupta", studentId: "MAA240075", college: "University of Madras" },
    { id: 96, name: "Reyansh Singh", studentId: "MAA240076", college: "Guru Gobind Singh Indraprastha University" },
    { id: 97, name: "Ananya Patel", studentId: "MAA240077", college: "Banaras Hindu University" },
    { id: 98, name: "Diya Kumar", studentId: "MAA240078", college: "Aligarh Muslim University" },
    { id: 99, name: "Aadhya Reddy", studentId: "MAA240079", college: "University of Kerala" },
    { id: 100, name: "Advika Sharma", studentId: "MAA240080", college: "University of Rajasthan" },
    // Additional 30 students
    { id: 250, name: "Rohan Desai", studentId: "MAA242501", college: "MIT Pune" },
    { id: 251, name: "Snehal Patil", studentId: "MAA242502", college: "COEP Pune" },
    { id: 252, name: "Amitabh Bachchan", studentId: "MAA242503", college: "Delhi University" },
    { id: 253, name: "Katrina Kaif", studentId: "MAA242504", college: "Mumbai University" },
    { id: 254, name: "Salman Khan", studentId: "MAA242505", college: "Aligarh Muslim University" },
    { id: 255, name: "Deepika Padukone", studentId: "MAA242506", college: "Mount Carmel College" },
    { id: 256, name: "Shah Rukh Khan", studentId: "MAA242507", college: "Hansraj College" },
    { id: 257, name: "Aishwarya Rai", studentId: "MAA242508", college: "DG Ruparel College" },
    { id: 258, name: "Hrithik Roshan", studentId: "MAA242509", college: "Sydenham College" },
    { id: 259, name: "Kareena Kapoor", studentId: "MAA242510", college: "Mithibai College" },
    { id: 260, name: "Ranbir Kapoor", studentId: "MAA242511", college: "Lee Strasberg Theatre and Film Institute" },
    { id: 261, name: "Alia Bhatt", studentId: "MAA242512", college: "Jamnabai Narsee School" },
    { id: 262, name: "Varun Dhawan", studentId: "MAA242513", college: "Nottingham Trent University" },
    { id: 263, name: "Sidharth Malhotra", studentId: "MAA242514", college: "Shaheed Bhagat Singh College" },
    { id: 264, name: "Tiger Shroff", studentId: "MAA242515", college: "American School of Bombay" },
    { id: 265, name: "Shraddha Kapoor", studentId: "MAA242516", college: "Boston University" },
    { id: 266, name: "Rajkummar Rao", studentId: "MAA242517", college: "University of Delhi" },
    { id: 267, name: "Kriti Sanon", studentId: "MAA242518", college: "Delhi Technological University" },
    { id: 268, name: "Ayushmann Khurrana", studentId: "MAA242519", college: "St. Stephen's College" },
    { id: 269, name: "Taapsee Pannu", studentId: "MAA242520", college: "Guru Tegh Bahadur Institute of Technology" },
    { id: 270, name: "Vicky Kaushal", studentId: "MAA242521", college: "Rajiv Gandhi Institute of Technology" },
    { id: 271, name: "Kiara Advani", studentId: "MAA242522", college: "Jai Hind College" },
    { id: 272, name: "Kartik Aaryan", studentId: "MAA242523", college: "DY Patil College of Engineering" },
    { id: 273, name: "Janhvi Kapoor", studentId: "MAA242524", college: "Lee Strasberg Theatre and Film Institute" },
    { id: 274, name: "Ishaan Khatter", studentId: "MAA242525", college: "American School of Bombay" },
    { id: 275, name: "Sara Ali Khan", studentId: "MAA242526", college: "Columbia University" },
    { id: 276, name: "Ananya Panday", studentId: "MAA242527", college: "University of Southern California" },
    { id: 277, name: "Tara Sutaria", studentId: "MAA242528", college: "St. Andrew's College" },
    { id: 278, name: "Aditya Roy Kapur", studentId: "MAA242529", college: "St. Xavier's College" },
    { id: 279, name: "Disha Patani", studentId: "MAA242530", college: "Delhi Public School" }
  ];

  const [mentors, setMentors] = useState(initialMentors);

  // Rest of the code remains the same...
  // Filter mentors based on search
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(search.toLowerCase()) ||
                        mentor.mentorId.toLowerCase().includes(search.toLowerCase()) ||
                        mentor.email.toLowerCase().includes(search.toLowerCase());
    
    if (mentorFilter === "available") {
      return matchesSearch && mentor.currentStudents < mentor.maxStudents;
    } else if (mentorFilter === "full") {
      return matchesSearch && mentor.currentStudents >= mentor.maxStudents;
    }
    
    return matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentMentors = filteredMentors.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  // Handle mentor selection for assignment
  const handleAssignStudents = (mentor) => {
    setSelectedMentor(mentor);
    setAssignmentMode(true);
    
    // Get available students (not already assigned to any mentor)
    const assignedStudentIds = new Set();
    mentors.forEach(m => m.students.forEach(s => assignedStudentIds.add(s.id)));
    
    const available = allStudents.filter(student => !assignedStudentIds.has(student.id));
    setAvailableStudents(available);
    setSelectedStudents([]);
  };

  // Handle student selection
  const toggleStudentSelection = (student) => {
    if (selectedStudents.some(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      // Check if mentor has capacity
      if (selectedStudents.length + selectedMentor.currentStudents < selectedMentor.maxStudents) {
        setSelectedStudents([...selectedStudents, student]);
      }
    }
  };

  // Confirm assignment
  const confirmAssignment = () => {
    if (selectedStudents.length === 0) return;

    // Update mentor's students
    const updatedMentors = mentors.map(mentor => {
      if (mentor.id === selectedMentor.id) {
        return {
          ...mentor,
          students: [...mentor.students, ...selectedStudents],
          currentStudents: mentor.currentStudents + selectedStudents.length
        };
      }
      return mentor;
    });

    setMentors(updatedMentors);
    setAssignmentMode(false);
    setSelectedMentor(null);
    setSelectedStudents([]);
    setStudentSearch("");
  };

  // Remove student from mentor
  const removeStudentFromMentor = (mentorId, studentId) => {
    const updatedMentors = mentors.map(mentor => {
      if (mentor.id === mentorId) {
        const updatedStudents = mentor.students.filter(s => s.id !== studentId);
        return {
          ...mentor,
          students: updatedStudents,
          currentStudents: updatedStudents.length
        };
      }
      return mentor;
    });

    setMentors(updatedMentors);
  };

  // Filter available students
  const filteredAvailableStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.college.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Toggle mentor expansion
  const toggleMentorExpansion = (mentorId) => {
    setExpandedMentor(expandedMentor === mentorId ? null : mentorId);
  };

  // Calculate total capacity statistics
  const totalCapacity = mentors.reduce((sum, mentor) => sum + mentor.maxStudents, 0);
  const totalAssigned = mentors.reduce((sum, mentor) => sum + mentor.currentStudents, 0);
  const availableCapacity = totalCapacity - totalAssigned;

  // CSS Styles in JS (add this new style for capacity stats)
  const styles = {
    // ... (keep all existing styles)
    page: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      '@media (max-width: 768px)': {
        padding: '1rem',
      },
    },

    // Add capacity stats container
    capacityStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },

    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
    },

    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '0.5rem',
    },

    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
    },

    // ... (keep all other existing styles exactly as they were)
    // Header Styles
    header: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1.5rem',
        alignItems: 'flex-start',
      },
    },

    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.75rem',
      },
    },

    headerIcon: {
      width: '48px',
      height: '48px',
      color: '#4f46e5',
      background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
      padding: '0.75rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    title: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 0.25rem 0',
      lineHeight: '1.2',
      '@media (max-width: 768px)': {
        fontSize: '1.5rem',
      },
    },

    subtitle: {
      color: '#6b7280',
      margin: '0',
      fontSize: '0.95rem',
      fontWeight: '400',
    },

    totalCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      padding: '0.75rem 1.25rem',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      '@media (max-width: 768px)': {
        alignSelf: 'flex-start',
      },
    },

    countIcon: {
      width: '20px',
      height: '20px',
      color: '#4f46e5',
    },

    countContent: {
      display: 'flex',
      flexDirection: 'column',
    },

    countNumber: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#111827',
      lineHeight: '1',
    },

    countLabel: {
      fontSize: '0.75rem',
      color: '#6b7280',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },

    // Search and Filter Styles
    searchFilterSection: {
      marginBottom: '2rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '0.75rem',
      },
    },

    searchContainer: {
      flex: '1',
      position: 'relative',
    },

    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '20px',
      height: '20px',
      pointerEvents: 'none',
      zIndex: '1',
    },

    searchInput: {
      width: '100%',
      padding: '0.875rem 1rem 0.875rem 3rem',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '1rem',
      color: '#111827',
      background: 'white',
      transition: 'all 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#4f46e5',
        boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
      },
      '&::placeholder': {
        color: '#9ca3af',
      },
    },

    filterContainer: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      background: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '10px',
      border: '2px solid #e5e7eb',
    },

    filterLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: '500',
    },

    filterSelect: {
      border: 'none',
      background: 'transparent',
      color: '#111827',
      fontWeight: '600',
      fontSize: '0.875rem',
      cursor: 'pointer',
      outline: 'none',
    },

    clearSearch: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: '#f3f4f6',
      border: 'none',
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      fontSize: '0.875rem',
      color: '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      '&:hover': {
        background: '#e5e7eb',
        color: '#374151',
      },
    },

    searchResults: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
      marginBottom: '1rem',
    },

    // Mentors Table Styles
    mentorsSection: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
    },

    mentorsContainer: {
      overflowX: 'auto',
      borderRadius: '12px',
    },

    mentorsTable: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px',
    },

    tableHeader: {
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      borderBottom: '2px solid #e5e7eb',
    },

    tableHeaderCell: {
      padding: '1.25rem 1.5rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap',
    },

    mentorRow: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      },
      '&:last-child': {
        borderBottom: 'none',
      },
    },

    mentorCell: {
      padding: '1.5rem 1.5rem',
      verticalAlign: 'top',
    },

    mentorInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },

    mentorName: {
      fontWeight: '600',
      color: '#111827',
      fontSize: '1.125rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    mentorId: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
    },

    mentorEmail: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },

    capacityInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },

    capacityText: {
      fontSize: '0.875rem',
      color: '#374151',
      fontWeight: '500',
    },

    capacityBar: {
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
    },

    capacityFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #4f46e5 0%, #3730a3 100%)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    },

    capacityFull: {
      fontSize: '0.75rem',
      color: '#ef4444',
      fontWeight: '500',
    },

    assignButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
      },
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
        background: '#9ca3af',
      },
    },

    // Students List Styles
    studentsSection: {
      marginTop: '1rem',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1rem',
    },

    studentsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      cursor: 'pointer',
    },

    studentsTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    studentsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },

    studentCard: {
      background: '#f9fafb',
      borderRadius: '8px',
      padding: '1rem',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    studentInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },

    studentName: {
      fontWeight: '500',
      color: '#111827',
    },

    studentId: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },

    studentCollege: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },

    removeButton: {
      background: '#fef2f2',
      color: '#ef4444',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: '#fee2e2',
      },
    },

    // Assignment Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    },

    modalContent: {
      background: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    },

    modalHeader: {
      padding: '1.5rem 2rem',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    },

    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#111827',
    },

    closeButton: {
      background: 'none',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: '#e5e7eb',
        color: '#374151',
      },
    },

    modalBody: {
      padding: '2rem',
      overflow: 'auto',
      flex: '1',
    },

    mentorSummary: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid #e5e7eb',
    },

    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      '&:last-child': {
        marginBottom: 0,
      },
    },

    summaryLabel: {
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: '500',
    },

    summaryValue: {
      color: '#111827',
      fontSize: '0.875rem',
      fontWeight: '600',
    },

    availableSlots: {
      color: '#10b981',
      fontSize: '0.875rem',
      fontWeight: '600',
    },

    studentsSelection: {
      marginTop: '2rem',
    },

    selectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },

    selectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827',
    },

    selectionCount: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },

    selectedCount: {
      color: '#4f46e5',
      fontWeight: '600',
    },

    studentSearchContainer: {
      position: 'relative',
      marginBottom: '1rem',
    },

    studentsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1rem',
      maxHeight: '300px',
      overflowY: 'auto',
      paddingRight: '0.5rem',
    },

    studentOption: {
      background: '#f9fafb',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#4f46e5',
        background: '#f5f3ff',
      },
      '&.selected': {
        borderColor: '#4f46e5',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      },
    },

    studentOptionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },

    checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: '2px solid #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      '&.checked': {
        background: '#4f46e5',
        borderColor: '#4f46e5',
        color: 'white',
      },
    },

    modalFooter: {
      padding: '1.5rem 2rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      background: '#f9fafb',
    },

    cancelButton: {
      padding: '0.75rem 1.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      background: 'white',
      color: '#374151',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: '#f3f4f6',
      },
    },

    confirmButton: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
      },
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
        background: '#9ca3af',
      },
    },

    // Empty State
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#6b7280',
    },

    emptyIcon: {
      width: '48px',
      height: '48px',
      color: '#d1d5db',
      margin: '0 auto 1rem',
      opacity: '0.5',
    },

    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: '0 0 0.5rem 0',
    },

    emptyText: {
      margin: '0',
      fontSize: '0.95rem',
    },

    // Pagination Styles
    paginationSection: {
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
    },

    paginationControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '0.75rem',
      },
    },

    paginationButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      background: 'white',
      color: '#374151',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '100px',
      justifyContent: 'center',
      fontSize: '0.875rem',
      '&:hover:not(:disabled)': {
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        borderColor: '#4f46e5',
        color: '#4f46e5',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)',
      },
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
      },
    },

    pageNumbers: {
      display: 'flex',
      gap: '0.5rem',
      '@media (max-width: 768px)': {
        order: '-1',
      },
    },

    pageNumber: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      background: 'white',
      color: '#374151',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      '&:hover': {
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        borderColor: '#4f46e5',
        color: '#4f46e5',
      },
      '&.active': {
        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
        color: 'white',
        borderColor: '#4f46e5',
        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
      },
    },

    pageInfo: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
      padding: '0.5rem 1rem',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
  };

  return (
    <div style={styles.page}>
      <Admintop activeTab="assignments" />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerIcon}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 style={styles.title}>Mentor Management</h1>
              <p style={styles.subtitle}>
                Assign students to mentors and manage relationships
              </p>
            </div>
          </div>
          
          <div style={styles.totalCount}>
            <Users style={styles.countIcon} />
            <div style={styles.countContent}>
              <span style={styles.countNumber}>{mentors.length}</span>
              <span style={styles.countLabel}>Active Mentors</span>
            </div>
          </div>
        </div>

        {/* Capacity Statistics */}
        <div style={styles.capacityStats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalCapacity}</div>
            <div style={styles.statLabel}>Total Capacity</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalAssigned}</div>
            <div style={styles.statLabel}>Students Assigned</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{availableCapacity}</div>
            <div style={styles.statLabel}>Available Slots</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{Math.round((totalAssigned / totalCapacity) * 100)}%</div>
            <div style={styles.statLabel}>Capacity Utilization</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div style={styles.searchFilterSection}>
          <div style={styles.searchContainer}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search mentors by name, ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button 
                style={styles.clearSearch}
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}
          </div>

          <div style={styles.filterContainer}>
            <div style={styles.filterLabel}>
              <Filter size={16} />
              Filter:
            </div>
            <select 
              value={mentorFilter} 
              onChange={(e) => setMentorFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Mentors</option>
              <option value="available">Available for Assignment</option>
              <option value="full">Fully Booked</option>
            </select>
          </div>
        </div>

        <div style={styles.searchResults}>
          Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
        </div>

        {/* Mentors Table */}
        <div style={styles.mentorsSection}>
          <div style={styles.mentorsContainer}>
            <table style={styles.mentorsTable}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeaderCell}>Mentor Information</th>
                  <th style={styles.tableHeaderCell}>Capacity (25 max)</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMentors.length > 0 ? (
                  currentMentors.map((mentor) => (
                    <React.Fragment key={mentor.id}>
                      <tr style={styles.mentorRow}>
                        <td style={styles.mentorCell}>
                          <div style={styles.mentorInfo}>
                            <div style={styles.mentorName}>
                              {mentor.name}
                            </div>
                            <div style={styles.mentorId}>{mentor.mentorId}</div>
                            <div style={styles.mentorEmail}>{mentor.email}</div>
                          </div>
                        </td>
                        <td style={styles.mentorCell}>
                          <div style={styles.capacityInfo}>
                            <div style={styles.capacityText}>
                              {mentor.currentStudents} / {mentor.maxStudents} students
                              <span style={{color: '#6b7280', fontSize: '0.75rem', marginLeft: '0.5rem'}}>
                                ({mentor.maxStudents - mentor.currentStudents} available)
                              </span>
                            </div>
                            <div style={styles.capacityBar}>
                              <div 
                                style={{
                                  ...styles.capacityFill,
                                  width: `${(mentor.currentStudents / mentor.maxStudents) * 100}%`
                                }}
                              />
                            </div>
                            {mentor.currentStudents >= mentor.maxStudents && (
                              <div style={styles.capacityFull}>
                                Fully Booked (25/25)
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={styles.mentorCell}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              style={styles.assignButton}
                              onClick={() => handleAssignStudents(mentor)}
                              disabled={mentor.currentStudents >= mentor.maxStudents}
                            >
                              <UserPlus size={16} />
                              Assign Students
                            </button>
                            <button
                              onClick={() => toggleMentorExpansion(mentor.id)}
                              style={{
                                ...styles.assignButton,
                                background: expandedMentor === mentor.id 
                                  ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                              }}
                            >
                              {expandedMentor === mentor.id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              View Students ({mentor.students.length})
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedMentor === mentor.id && (
                        <tr style={styles.mentorRow}>
                          <td colSpan="3" style={{ padding: '0' }}>
                            <div style={styles.studentsSection}>
                              <div 
                                style={styles.studentsHeader}
                                onClick={() => toggleMentorExpansion(mentor.id)}
                              >
                                <div style={styles.studentsTitle}>
                                  <Users size={16} />
                                  Assigned Students ({mentor.students.length})
                                </div>
                              </div>
                              {mentor.students.length > 0 ? (
                                <div style={styles.studentsList}>
                                  {mentor.students.slice(0, 12).map((student) => (
                                    <div key={student.id} style={styles.studentCard}>
                                      <div style={styles.studentInfo}>
                                        <div style={styles.studentName}>{student.name}</div>
                                        <div style={styles.studentId}>{student.studentId}</div>
                                        <div style={styles.studentCollege}>{student.college}</div>
                                      </div>
                                      <button
                                        style={styles.removeButton}
                                        onClick={() => removeStudentFromMentor(mentor.id, student.id)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                  {mentor.students.length > 12 && (
                                    <div style={{
                                      ...styles.studentCard,
                                      justifyContent: 'center',
                                      background: '#f0f9ff',
                                      borderColor: '#0ea5e9'
                                    }}>
                                      <div style={{
                                        ...styles.studentInfo,
                                        alignItems: 'center'
                                      }}>
                                        <div style={{
                                          ...styles.studentName,
                                          color: '#0ea5e9'
                                        }}>
                                          + {mentor.students.length - 12} more students
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={styles.emptyState}>
                                  <p style={styles.emptyText}>No students assigned yet</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={styles.emptyState}>
                      <Search style={styles.emptyIcon} size={48} />
                      <h3 style={styles.emptyTitle}>No mentors found</h3>
                      <p style={styles.emptyText}>Try a different search term or filter</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredMentors.length > itemsPerPage && (
          <div style={styles.paginationSection}>
            <div style={styles.paginationControls}>
              <button
                style={styles.paginationButton}
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              <div style={styles.pageNumbers}>
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    style={{
                      ...styles.pageNumber,
                      ...(page === pageNum ? { 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: 'white',
                        borderColor: '#4f46e5',
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
                      } : {})
                    }}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <button
                style={styles.paginationButton}
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div style={styles.pageInfo}>
              Page {page} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assignmentMode && selectedMentor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Assign Students to Mentor</h2>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setAssignmentMode(false);
                  setSelectedMentor(null);
                  setSelectedStudents([]);
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.mentorSummary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Mentor Name:</span>
                  <span style={styles.summaryValue}>{selectedMentor.name}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Mentor ID:</span>
                  <span style={styles.summaryValue}>{selectedMentor.mentorId}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Current Students:</span>
                  <span style={styles.summaryValue}>{selectedMentor.currentStudents} / {selectedMentor.maxStudents}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Available Slots:</span>
                  <span style={styles.availableSlots}>
                    {selectedMentor.maxStudents - selectedMentor.currentStudents - selectedStudents.length} remaining
                  </span>
                </div>
              </div>

              <div style={styles.studentsSelection}>
                <div style={styles.selectionHeader}>
                  <div>
                    <h3 style={styles.selectionTitle}>Select Students to Assign</h3>
                    <div style={styles.selectionCount}>
                      <span style={styles.selectedCount}>{selectedStudents.length}</span> of {availableStudents.length} available students selected
                    </div>
                  </div>
                </div>

                <div style={styles.studentSearchContainer}>
                  <Search style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search students by name, ID, or college..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>

                <div style={styles.studentsGrid}>
                  {filteredAvailableStudents.slice(0, 20).map((student) => {
                    const isSelected = selectedStudents.some(s => s.id === student.id);
                    const canSelect = selectedStudents.length + selectedMentor.currentStudents < selectedMentor.maxStudents;
                    
                    return (
                      <div
                        key={student.id}
                        style={{
                          ...styles.studentOption,
                          ...(isSelected ? { borderColor: '#4f46e5', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' } : {})
                        }}
                        onClick={() => canSelect && toggleStudentSelection(student)}
                      >
                        <div style={styles.studentOptionHeader}>
                          <div style={styles.studentInfo}>
                            <div style={styles.studentName}>{student.name}</div>
                            <div style={styles.studentId}>{student.studentId}</div>
                            <div style={styles.studentCollege}>{student.college}</div>
                          </div>
                          <div style={{
                            ...styles.checkbox,
                            ...(isSelected ? { background: '#4f46e5', borderColor: '#4f46e5', color: 'white' } : {})
                          }}>
                            {isSelected && <Check size={14} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredAvailableStudents.length > 20 && (
                    <div style={{
                      ...styles.studentOption,
                      background: '#f0f9ff',
                      borderColor: '#0ea5e9',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        + {filteredAvailableStudents.length - 20} more students available
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#0ea5e9'
                      }}>
                        Use search to find specific students
                      </div>
                    </div>
                  )}
                </div>

                {filteredAvailableStudents.length === 0 && (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No available students found</p>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setAssignmentMode(false);
                  setSelectedMentor(null);
                  setSelectedStudents([]);
                }}
              >
                Cancel
              </button>
              <button
                style={styles.confirmButton}
                onClick={confirmAssignment}
                disabled={selectedStudents.length === 0}
              >
                <Check size={16} />
                Assign {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentorAssignments;