const csv = require('async-csv');
const fs = require('fs');

module.exports = function(Drug) {

    Drug.updateData = async function() {

        const options = {
            columns: true,
            delimiter: "\t",
        };

        let res = [];
        let ret;

        try {
            console.log('creating product map');
            console.log('reading file');
            let productsInput = await fs.readFileSync('/app/data/products.csv', 'utf8');
            let products = await csv.parse(productsInput, options);

            const productMap = {};

            console.log('iterating');
            products.forEach((product) => {
                productMap[product.PRODUCTNDC] = product;
            });

            productsInput = null;
            products = null;

            console.log('done creating product map');

            console.log('creating package list');
            console.log('reading file');
            let packagesInput = await fs.readFileSync('/app/data/packages.csv', 'utf8');
            let packages = await csv.parse(packagesInput, options);

            let drugs = [];

            console.log('mapping drugs');

            drugs = packages.map((drug) => {
                const product = productMap[drug.PRODUCTNDC];
                
                return {
                    productId: drug.PRODUCTID,
                    productNDC: drug.PRODUCTNDC,
                    productNDCInt: drug.PRODUCTNDC.replace(/[^0-9\.]+/g, ''),
                    ndcPackageCode: drug.NDCPACKAGECODE,
                    packageDescription: drug.PACKAGEDESCRIPTION,
                    startMarketingDate: drug.STARTMARKETINGDATE,
                    endMarketingDate: drug.ENDMARKETINGDATE,
                    ndcExcludeFlag: drug.NDC_EXCLUDE_FLAG,
                    samplePackage: drug.SAMPLE_PACKAGE,
                    productTypeName: product.PRODUCTTYPENAME,
                    proprietaryName: product.PROPRIETARYNAME,
                    proprietaryNameSuffix: product.PROPRIETARYNAMESUFFIX,
                    nonProprietaryName: product.NONPROPRIETARYNAME,
                    dosageFormName: product.DOSAGEFORMNAME,
                    routeName: product.ROUTENAME,
                    marketingCategoryName: product.MARKETINGCATEGORYNAME,
                    applicationNumber: product.APPLICATIONNUMBER,
                    substanceName: product.SUBSTANCENAME,
                    deaSchedule: product.DEASCHEDULE,
                };
            });

            packagesInput = null;
            products = null;
            packages = null;

            const step = 1000;
            const chunks = Math.ceil(drugs.length / step); 
            const chunkedDrugs = [];

            console.log('chunking drugs and inserting');

            // if it gets this far and can parse all of the data, then delete and re-populate
            await Drug.destroyAll();

            for (let ii = 0; ii < chunks; ii++) {
                console.log(`chunk ${ii}`);
                const curr = drugs.slice(ii * step, (ii + 1) * step);
                const r = await Drug.create(curr);
                res.push(r);
            }

            console.log('done chunking');

            res.reduce((acc, curr) => acc && curr, true);

            if (!res) {
                throw new Error('Could not create the drugs based on the input');
            }

            ret = {
                success: true,
                result: res,
            };
        } catch(err) {
            console.error(err);

            ret = {
                success: false,
                result: res,
                errors: err,
            };
        }

        console.log(ret);

        return ret;
    };

    Drug.remoteMethod('updateData', {
        accepts: [],
        returns: {
            arg: 'result',
            type: 'object',
        },
    });
};
