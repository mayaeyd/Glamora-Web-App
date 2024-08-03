import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port=3000;
const API_URL="http://makeup-api.herokuapp.com";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",async (req,res)=>{
        res.render("index.ejs");
});

app.get("/secret", async (req,res)=>{
    try{
        const result= await axios.get(`http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${req.query.type}`);
        const response=result.data;
        const loggedBrands = new Set();

        response.forEach(product => {
            if(product.brand){
                const normalizedBrand = product.brand.trim().toLowerCase();
                    if (!loggedBrands.has(normalizedBrand)) {
                        loggedBrands.add(normalizedBrand);
                    }
                }
        });
        res.render("brands.ejs",
            {
                brands:loggedBrands,
                productType:req.query.type
            });
    }
    catch(error){
        console.log(error.response.data); 
    }
});

app.get("/products",async (req,res)=>{
    try{
        const productType=req.query.type;
        const brand= req.query.brand;

        console.log(`product type: ${productType}`);
        console.log(`brand: ${brand}`);

        const result= await axios.get(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${productType}`);
        const response =result.data;
        res.render("products.ejs",{products:response});
    }
    catch(error){
        console.log(error.response.data);
    }
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

