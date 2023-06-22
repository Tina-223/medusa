import { Router } from "express"
import Medusa from "@medusajs/medusa-js"
import { stat } from "fs";

export default (rootDirectory: string): Router | Router[] => {
  // add your custom routes here
  const router = Router()
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

  router.get("/product/:productNo", (req, res) => {
    const productId = req.params.productNo;
    let responseData = {}
    medusa.admin.products.retrieve(productId)
    .then(({ product }) => {
      res.send(product);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });

  router.post("/product/:title", (req, res) => {
    const title = req.params.title;
    const subtitle = req.body.subtitle;
    console.log(typeof subtitle);
    const description = req.body.description;
    const categories = req.body.categories;
    const imageList = req.body.images;
    const status = req.body.status;
    const options = req.body.options;
    const variants = req.body.variants;
    let responseData = {}
    console.log(typeof subtitle);
    // medusa.admin.products.create({
    //   title: title,
    //   subtitle: subtitle,
    //   description: description,
    //   categories: categories,
    //   is_giftcard: false,
    //   discountable: false,
    //   images: imageList,
    //   status: status,
    //   options: options,
    //   variants: variants,
    // })
    // .then(({ product }) => {
    //   res.send(product.id);
    // })
    // .catch((err) => {
    //   res.status(500).send(err);
    // });
  });

  router.put("/product/:title", (req, res) => {
    const title = req.params.title;
    const subtitle = req.body.subtitle;
    const imageList = req.body.images;
    const status = req.body.status;
    const options = req.body.options;
    const variants = req.body.variants;
    let responseData = {}
    medusa.admin.products.create({
      title: title,
      subtitle: subtitle,
      is_giftcard: false,
      discountable: false,
      images: imageList,
      status: status,
      options: options,
      variants: variants,
    })
    .then(({ product }) => {
      res.send(product.id);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });

  router.delete("/product/:productNo", (req, res) => {
    const productNo = req.params.productNo;
    medusa.admin.products.delete(productNo)
    .then(({ id, object, deleted }) => {
      if (deleted) {
        console.log(id);
        res.send(id);
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
