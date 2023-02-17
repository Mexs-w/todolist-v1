import express, { response } from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

// console.log(process.env.MONGODB_URI);



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import { date } from "${dirname}/date.js";

// var items = [];
// let workList = [];



const app = express();

const port = process.env.PORT || 3000;

// const username = process.env.MONGODB_CLUSTER0_USERNAME;
// const password = process.env.MONGODB_CLUSTER0_PASSWORD;
// console.log(username,password);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

const uri = process.env.MONGODB_URI

// console.log(uri)



mongoose.connect(uri + "/todolistDb");
// mongoose.connect("mongodb+srv://mexs:olumide@cluster0.a18j3qv.mongodb.net/todolistDb");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must include todo!!!"]
    }
})

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must include name of category"]
    },
    items: [itemSchema]
})



const Item = new mongoose.model("Item", itemSchema)

const List = new mongoose.model("List", listSchema)


const item1 = new Item({
    name: "Welcome to your todolist!"
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to checkout an item."
})



app.get('/', function(req,res) {
    // var theDate = date.getDate();

    Item.find(function(err, items) {
        // if (err){
        //     console.log(err);
        // }else{
        if (items.length === 0){

            Item.insertMany([item1,item2,item3], function(err) {
            if (err){
                console.log(err);
            }else{
                console.log("Successfully added all items")
            }
            res.redirect('/');
        })
        }else{
            res.render('todo', {
            listTitle: "Today",
            newListItems: items
        })
        } 
        }
    // }
    )

    // console.log(items)
    
})

// app.get("/work", function(req, res) {
//     // console.log(req.body)
//     res.render('todo', {
//         listTitle: "Work List",
//         newListItems: workList
//     })

// })

// app.get('/about', function(req,res) {
//     res.render('about');
// })


app.get('/:paramName', function(req,res) {
    var cateroryName=  _.capitalize(req.params['paramName']);

    List.findOne({ name: cateroryName }, function (err, result) {
        if (result) {

            // SHOW EXISTING LIST

            res.render('todo', {
                listTitle: cateroryName,
                newListItems: result.items
            })
            

        } else {

            // CREATE NEW LIST

            const list = new List({
                name: cateroryName,
                items: [item1,item2,item3]
            })


            list.save();

            res.redirect('/' + cateroryName);
        }
    });


    
})





app.post('/', function(req,res) {
    // console.log(req.body)
    var itemName = req.body.newItem;
    var listName = req.body.list;
    
    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect('/');  
    } else {
        List.findOne({name: listName}, function(err, result) {
            result.items.push(item); 
            result.save();
            res.redirect('/' + listName);
        })
    }




    // if (req.body.list === "Work") {
    //     workList.push(item);
    //     res.redirect('/work')
    // }else{

    //     const item = new Item({
    //         name: item
    //     })

    //     // items.push(item);
    //     res.redirect('/')
    // }

})


app.post('/delete', function(req,res) {
    var id = req.body.checkbox;
    var listName = req.body.title;
    // console.log(id, listName);

    if (listName === "Today") {
        Item.deleteOne({_id: id}, function(err) {
            if (err) {
                console.log(err)
            }else{
                // console.log("Item deleted successfully from the database.");
                res.redirect('/');
            }   
    })
    }else {

        List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:id}}}, function(err, result) {
                if (!err) {
                    res.redirect('/' + listName);
                }
            }
        )
    }

    
})








// app.post('/work', function(req,res) {
//     var item = req.body.newItem;
//     workList.push(item);

//     res.redirect('/')
// })



app.listen(port, function(){ 
    console.log('Your server is currently running on port number ' + port)
})

// var currentDay = today.getDay()
// var dayID = 0;
// var daysOfTheWeek = ["Sunday","Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// if (currentDay === 0 || currentDay === 6) {
//     day = "Weekend";
//     res.render('todo', {current:day});
// }else{
//     day = "Weekday";
    // res.sendFile(__dirname + '/index.html');
// }