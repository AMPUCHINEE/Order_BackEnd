require("dotenv").config();//เรียกไลเบอรี่configฟังก์ชันพื้นฐาน
const express = require("express");
const app = express();
const Sequlize = require("sequelize");
const port = process.env.PORT || 3001;

const sequelize = new Sequlize("database","username","password",{
    host: "localhost",
    dialect: "sqlite",
    storage: "./Database/Order.sqlite",
 });//คอนเนท สร้างดาต้าเบส

const category = sequelize.define("category", {
    category_id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category_name: {
        type:Sequlize.STRING,
        allowNull: false,//ต้องใส่ข้อมูล
    },
});

const product = sequelize.define("product", {
    product_id: {
        type : Sequlize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_name: {
        type:Sequlize.STRING,
        allowNull: false,
    },
    product_amount: {
        type: Sequlize.INTEGER,
        allowNull: false,
    },
    product_price: {
        type: Sequlize.DOUBLE,
        allowNull: false,
    },
    category_id: {
        type: Sequlize.INTEGER,
        allowNull: false,
    },
});

//hasmany 1 to many 
//belongsTo many to 1
category.hasMany(product, {
    foreignKey: "category_id",
});
product.belongsTo(category, {
    foreignKey: "category_id",
});
sequelize.sync();


//app.set(express.json());//เซ็ทให้รับส่งเปนเจสัน ถ้ามีไลเบอรี่อื่นให้ใช้เซ็ท
app.use(express.json());//ใช้ให้รับส่งเป็นเจสัน

//api
app.get("/",(req,res)=> {
    res.status(200).json("Hello world");
    //res.status(200).json("Hello World");//"/"เส้นทาง 200ส่งข้อมูลแบบสำเร็จ ส่งข้อมูลแบบเจสัน
});

app.get("/category/:category_id",(req,res)=> {
    category.findByPk(req.params.category_id)
    .then((row)=> {
        res.status(200).json(row);
    })
    .catch((err) => {
        console.log(err);
        //res.status(200).json();
    })
});

app.get("/product",(req,res) => {
    product.findAll({
        include:[
            {
                model:category,
                attributes: ["category_name"],
            },
        ],
    })
    .then((row)=> {
        res.status(200).json(row);
    })
    .catch((err) => {
        console.log(err);
    })
});


app.put("/category/:category_id",(req,res) => {
    category.findByPk(req.params.category_id) 
        .then((category)=> {
             category
             .update(req.body)
             .then((row)=> {
                res.status(200).json(row);
            })
            .catch((err) => {
                console.log(err);
                //res.status(200).json();
            })
        })
        .catch((err) => {
            console.log(err);
            //res.status(200).json();
        });
});

app.put("/product/:product_id",(req,res) => {
    product.findByPk(req.params.product_id)
    .then((product) => {
        product
        .update(req.body)
        .then((row) => {
            res.status(200).json(row);
        })
        .catch((err) => {
            console.log(err);
        })
    })
    .catch((err) => {
        console.log(err);
        
    });
})

app.delete("/category/:category_id",(req,res) => {
    category.findByPk(req.query.category_id)
    .then((category)=> {
        category
        .destroy()
        .then((row)=> {
            res.status(200).json(row);
        })
        .catch((err) => {
            console.log(err);
            
        })
    })
    .catch((err) => {
        console.log(err);
    });

});

app.delete("/product/:product_id",(req,res) => {
    product.findByPk(req.params.product_id)
    .then((product)=> {
        product
        .destroy()
        .then((row)=> {
            res.status(200).json(row);
        })
        .catch((err) => {
            console.log(err);
            
        })
    })
    .catch((err) => {
        console.log(err);
    });
});


//by param /category/:catetory_name ใช้ json(req.params.categoty_name) หลังparamใส่ค่าอะไรก็ได้จะใส่ข้อมูลเข้าไป
//by body json(req.body)
//by query ใช้req.query ในpostman category?category_name=hello&product_name=LG ฟิกค่า
app.post("/category",(req,res) => {
    category.create(req.body)
    .then((rows)=> {
        res.status(200).json(rows);
    })
    .catch((err) => {
        console.log(err);
        //res.status(200).json();
    })
});

app.post("/product",(req,res) => {
    product.create(req.body)
    .then((rows)=> {
        res.status(200).json(rows);
    })
    .catch((err) => {
        console.log(err);
    })
    //res.status(200).json("Ah");
});

app.listen(port,function() {
    console.log(`server run on port ${port}`);
});

