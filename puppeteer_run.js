const puppeteer = require('puppeteer'); 

module.exports = async function puppeteer_run(url) {
            
    let browser;
    var opsys = process.platform;
    if (opsys == "darwin") {
        opsys = "MacOS";
    } else if (opsys == "win32" || opsys == "win64") {
        opsys = "Windows";
    } else if (opsys == "linux") {
        opsys = "Linux";
    }
    if(opsys != "Windows") {
        browser = await puppeteer.launch( {
            headless: true,  //change to true in prod!
            executablePath: '/usr/bin/google-chrome-stable'
        }); 
    } else {
        browser = await puppeteer.launch( {
            headless: true
        }); 
    }

    const page = await browser.newPage(); 
    
    await page.setDefaultNavigationTimeout(0);
    
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36")
   
    const response = await page.goto(url);

    let innerText = await page.content(); 
    
    let headers = await response.headers();
    let status = await response.status();

    let element = await page.$('pre')
    let value = null;
    try {
        value = await page.evaluate((el) => {
          if(el && typeof el.textContent != 'undefined')
            return el.textContent;
          else
            return null;
        }, element);
    } catch (e) {  
        console.log('ERROR with puppeteer :' + url, e);  
    }
    
    if(value == null)
        console.log('ERROR with puppeteer :' + url);  
    
    await browser.close(); 

    if(value) {
        //console.log("puppeteer SUCCESS (1)", value.substring(0,100));
    }
    
    return {
        body: value,
        headers : headers,
        statusCode : status
    };
};
