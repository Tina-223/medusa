import { Router } from "express"
import Medusa from "@medusajs/medusa-js"
import { stat } from "fs";
import express from "express";

export default (rootDirectory: string): Router | Router[] => {
  // add your custom routes here
  const router = Router()
  router.use(express.json())
  router.use(express.urlencoded({extended: false}))
  const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3, apiKey: "hello" });

  router.get("/products", (req, res) => {
    let responseData = {}
    medusa.admin.products.list()
    .then(({ products, limit, offset, count }) => {
      res.send(products);
      for (let i = 0; i<count; i++) {
        console.log(products[i].id);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });

  router.get("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    medusa.admin.products.retrieve(productId)
    .then(({ product }) => {
      res.send(product);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });


  router.post("/products", (req, res) => {
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const description = req.body.description;
    const categories = req.body.categories;
    const imageList = req.body.images;
    const status = req.body.status;
    const options = req.body.options;
    const variants = req.body.variants;
    let responseData = {}
    medusa.admin.products.create({
      title: title,
      subtitle: subtitle,
      description: description,
      categories: categories,
      is_giftcard: false,
      discountable: false,
      images: imageList,
      status: status,
      options: options,
      variants: variants,
    })
    .then(({ product }) => {
      responseData["productId"] = product.id
      res.send(responseData);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });

  router.put("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    console.log(typeof productId)
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const description = req.body.description;
    const categories = req.body.categories;
    const imageList = req.body.images;
    const status = req.body.status;
    const options = req.body.options;
    const variants = req.body.variants;
    let responseData = {}
    medusa.admin.products.update(productId, {
      title: title,
      subtitle: subtitle,
      description: description,
      categories: categories,
      discountable: false,
      images: imageList,
      status: status,
      variants: variants,
    })
    .then(({ product }) => {
      responseData["productId"] = product.id
      res.send(responseData)
      console.log(product.id);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });

  router.delete("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    let responseData = {}
    medusa.admin.products.delete(productId)
    .then(({ id, object, deleted }) => {
      if (deleted) {
        responseData["productId"] = id;
        res.send(responseData);
      } else {
        throw new Error("delete fail");
      }
    })
    .catch((err) => {
      if (err.message === "delete fail") {
        let result = {
          code: 'FAIL',
          message: err.message,
        };
        res.status(400).send(result);
      } else {
        res.status(500).send(err);
      }
    });
  })

  return [router]
}
