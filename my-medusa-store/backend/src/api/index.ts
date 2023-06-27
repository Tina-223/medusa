import { Router } from "express"
import Medusa from "@medusajs/medusa-js"
import { stat } from "fs";
import express from "express";
import session from "express-session";

export default (rootDirectory: string): Router | Router[] => {
  // add your custom routes here
  const productsRouter = Router()
  const authRouter = Router()
  authRouter.use(express.json())
  authRouter.use(express.urlencoded({ extended: false }))
  productsRouter.use(express.json())
  productsRouter.use(express.urlencoded({ extended: false }))
  const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3, apiKey: "hello" });

  authRouter.get("/api/v1/admin/auth", (req, res) => {
    // const requestBody = {}
    // requestBody["user"] = req.body;
    // // const user = req.body;
    // // user["userId"]
    // requestBody["user"]["userId"] = req.body.id;
    console.log("apipiapofijaodif")
    // console.log(JSON.stringify(requestBody));
    medusa.admin.auth.getSession()
      .then(({ user }) => {
        console.log(user.id);
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  authRouter.post("/api/v1/admin/auth", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    medusa.admin.auth.createSession({
      email: email,
      password: password
    })
      .then(({ user }) => {
        console.log(user);
        // req.session.user = {
        //   email: email,
        //   password: password
        // }
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  authRouter.delete("/api/v1/admin/auth", (req, res) => {
    medusa.admin.auth.deleteSession()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })


  productsRouter.get("/api/v1/admin/products", (req, res) => {
    let responseData = {}
    medusa.admin.products.list()
      .then(({ products, limit, offset, count }) => {
        res.send(products);
        for (let i = 0; i < count; i++) {
          console.log(products[i].id);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  productsRouter.get("/api/v1/admin/products/:productId", (req, res) => {
    const productId = req.params.productId;
    medusa.admin.products.retrieve(productId)
      .then(({ product }) => {
        res.send(product);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });


  productsRouter.post("/api/v1/admin/products", (req, res) => {
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

  productsRouter.put("/api/v1/admin/products/:productId", (req, res) => {
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

  productsRouter.delete("/api/v1/admin/products/:productId", (req, res) => {
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

  return [authRouter, productsRouter]
}
