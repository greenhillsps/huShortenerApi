
Users = {
    1: {
        id: ObjectId,
        firstName: String,
        LastName: String,
        email: String,
        password: String,
        mobileNo: String,
        createdAt: Date,
        isPaid: Boolean,
        Urls: [ForeignkeyUrls],
        walletAmount: Number, //optional
        transactionHistory: { 
            featureBought: String,
            AmountPaid: Number,
        }
    }
}
Urls = {
    1: {
        id: ObjectId,
        createdAt: Date,
        Users: ForeignkeyUsers, //optional
        actualUrl: String,
        shortUrl: String,
        analytics: [{  
            clickDate: String,
            device: String,
            browser: String,
            language: String,
            refferer: String,
            countrie: String,
            Regions: String,
        },], //optional
        features: { 
            locked: Boolean,
            customExpiryDate: {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.customExpiryDate': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                customExpiryDate: Date,
            },
            UrlRedirectto: {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.UrlRedirectto': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                Url: String,
            },
            enableToggle: {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.enableToggle': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                enable: Boolean,
            },
            BlockIps: {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.BlockIps': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                ips: ["192.168.1.1", "192.168.1.2"],

            },
            CustomReports: {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.CustomReports': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                any: any,
            },
            'fourOfour': {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.fourOfour': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                any: any,
            },
            customShortUrl: {
                locked: Boolean,
                puchaseDate: Date,
                'pricelist.customShortUrl': Foreignkey,
                boughtPrice: Number,
                expiryDate: Date,
                originalUrl: String,
                shortUrl: String,
            }
        } //optional
    },
} 

feedback = {
    1: {
        id :ObjectId,
        Users: ForeignkeyUsers, //optional
        name: String,
        email: String,
        message: String,
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
          },
    }
}
pricelist = {
    id:ObjectId,
    customExpiryDate: {
        price: Number,
        activeFor: Date
    },
    UrlRedirectto: {
        price: Number,
        activeFor: Date
    },
    enableToggle: {
        price: Number,
        activeFor: Date
    },
    BlockIps: {
        price: Number,
        activeFor: Date
    },
    CustomReports: {
        price: Number,
        activeFor: Date
    },
    'fourOfour': {
        price: Number,
        activeFor: Date
    },
    customShortUrl: {
        price: Number,
        activeFor: Date
    }
}