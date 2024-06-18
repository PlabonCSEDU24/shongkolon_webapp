interface User {
  _id: string;
  name: string;
  email: string;
  contact_no: string;
  profilePhoto: profilePhoto;
}

interface Post {
  _id: string;
  userId: string;
  bookName: string;
  author: string;
  category: string;
  description: string;
  contactInfo: contactInfo;
  price: number;
  photos: photo[];
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: Date;
}

interface profilePhoto {
  fileName: string | null;
  path: string | null;
}

interface contactInfo {
  address: string;
  phone: string;
  geoCode: { latitude: string; longitude: string };
}

interface photo {
  fileName: string;
  path: string;
}

export { User, Post, Comment };
