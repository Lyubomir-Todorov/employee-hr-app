import Vue from 'vue'
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { doc, addDoc, deleteDoc, getDoc, getFirestore, getDocs, collection, updateDoc, arrayUnion, arrayRemove, query, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBDv7e6FNIdthlx0bCmz5v2zeRCXnaG1J0",
    authDomain: "vuejs-backend-demo.firebaseapp.com",
    projectId: "vuejs-backend-demo",
    storageBucket: "vuejs-backend-demo.appspot.com",
    messagingSenderId: "1094637691283",
    appId: "1:1094637691283:web:99df984eb7ffe91a1e4866"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();


Vue.mixin({
    data: function() {
        return {
            isLoggedIn: false,
            isLogout: false,
            isAdministrator: false,
            userInformationRetrieved: false,
            userInformationError: false,
            info: {},
            courses: {},
            registeredCourses: {},
            registeredCourseInfo: {},
            registeredCoursesFound: false,
            courseId: 0,
            coursesFound: false,
            coursesLooking: false,
            performingTask: false,

            loading: false,
        };
    },
    methods: {
        async get_account() {

            this.loading = true;
            this.userInformationRetrieved = false;

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.isLoggedIn = true;

                    const docRef = doc(db, "users", user.uid);
                    getDoc(docRef).then(e => {
                        this.userInformationRetrieved = true;
                        this.info = e.data();
                        this.registeredCourses = e.data().registered_courses ?? {};
                    }).catch(() => {
                        this.info = {};
                        this.userInformationError = true;
                    });
                    this.loading = false;
                    auth.currentUser.getIdTokenResult()
                        .then((idTokenResult) => {
                            this.isAdministrator = idTokenResult.claims.admin ?? false;
                        })
                        .catch((error) => {
                            console.log(error)
                        });
                } else {
                    this.loading = false;
                    this.isLoggedIn = false;
                }
            });
        },

        async change_password(newPassword) {
            await updatePassword(auth.currentUser, newPassword).then(() => {
                this.displayToast("Password successfully changed!")
            }).catch((err) => {
                if (err.code === "auth/requires-recent-login") {
                    this.displayToast("For security reasons, a recent login is required. Please logout and login", "is-warning", 10000)
                }
                this.displayToast(err.message,"is-danger", 5000);
            })
        },

        async update_account(data) {
            this.loading = true;

            const docRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(docRef, data).then(() => {
                this.displayToast("Successfully updated information");
                const temp = this.info.display_id;
                this.info = data;
                this.info.display_id = temp;
            }).catch(() => {
                this.displayToast("There was an error updating your info!", "is-error");
            }).finally(() => {
                this.loading = false;
            });
        },

        async get_courses() {
            this.courseId = 0;
            this.coursesLooking = true;
            const querySnapshot = await getDocs(collection(db, "training_courses"));
            querySnapshot.forEach((doc) => {
                this.courses[this.courseId] = doc.data();
                this.courses[this.courseId++].courseId = doc.id;
                this.coursesFound = true;
                this.coursesLooking = false;
            });
        },

        async get_registered_courses() {

            if (this.registeredCourses.length===0) return false;

            let i = 0;
            const q = query(collection(db, "training_courses"), where("id", "in", this.registeredCourses));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.registeredCourseInfo[i++] = doc.data();
            });
        },

        async create_course(data) {
            this.loading = true;
            const docRef = (collection(db, "training_courses"));

            let error = false;

            await addDoc(docRef, data).then((e) => {
                data.id = e.id;
                try {
                    updateDoc(doc(db, "training_courses", e.id), data);
                } catch(er) {
                    error = true;
                }
            }).catch((err) => {
                console.log(err)
                error = true;
            }).finally(() => {
                this.loading = false;

                if (error) {
                    this.displayToast("There was an error creating the course!", "is-danger");
                } else {
                    this.displayToast("Successfully created course");
                }

            });
        },

        async update_course(data, id) {
            this.performingTask = true;

            const docRef = doc(db, "training_courses", id);
            await updateDoc(docRef, data).then(() => {
                this.displayToast("Successfully updated course");
                this.courses = Object.values(this.courses).filter(function(item) {
                    if (item.id === id) {

                        item.title = data.title;
                        item.coursecode = data.coursecode;
                        item.startdate = data.startdate;
                        item.enddate = data.enddate;
                        item.description = data.description;
                        item.totalhours = data.totalhours;

                        return item;
                    } else {
                        return item;
                    }
                });
            }).catch((err) => {
                console.log(err)
                this.displayToast("There was an error updating the course!", "is-danger");
            }).finally(() => {
                this.performingTask = false;
            });
        },

        async delete_course(course) {
            this.loading = true;

            const docRef = doc(db, "training_courses", course.id);
            await deleteDoc(docRef).then(() => {
                this.displayToast("Successfully deleted course");
                this.courses = Object.values(this.courses).filter(function(item) {return item.id !== course.id});
            }).catch((err) => {
                console.log(err)
                this.displayToast("There was an error deleting the course!", "is-danger");
            }).finally(() => {
                this.loading = false;
            });

        },

        async register_to_course(course) {

            const docRef = doc(db, "users", auth.currentUser.uid);
            const tempCourse = {
                title: course.title,
                id: course.id,
                code: course.courseCode
            };

            await updateDoc(docRef, {
                registered_courses: arrayUnion(course.id)
            }).then(() => {
                this.displayToast(`Successfully registered to ` + tempCourse.code);
                return true;
            }).catch(() => {
                this.displayToast(`Error: Could not register to ` + tempCourse.code, "is-danger");
                return false;
            });
        },

        async withdraw_from_course(course) {

            const docRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(docRef, {
                registered_courses: arrayRemove(course.id)
            }).then(() => {
                this.registeredCourses = this.registeredCourses.filter(function(f) { return f !== course })
                this.registeredCourseInfo = Object.values(this.registeredCourseInfo).filter(function(f) { return f !== course })

                this.displayToast(`Successfully withdrawn from course!`);
                return true;
            }).catch(() => {
                this.displayToast(`Error: Could not withdraw from course`, 'is-danger');
                return false;
            });
        },

        async resetPassword(email) {
            this.loading = true;
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    this.displayToast("Email successfully sent")
                }).catch((error) => {
                    this.displayToast(error.message, "is-danger")
                }).finally(()=> {
                    this.loading = false;
                });

        },

        async logout(t = true) {
            signOut(auth).then(() => {
                this.isLogout = true;

                if (t) {
                    this.$router.push({ path: "/login", query: { logout: 'true' } }).catch(()=>{});
                } else {
                    this.$router.push({ path: "/login"}).catch(()=>{});
                }

            }).catch((error) => {
                this.error = error;
            });
        },
    } 
})


