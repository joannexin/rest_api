const fs = require('fs');
const path = require('path');
const request = require('request');

// export module so that server could require it
module.exports = (app) => {
  // create an object to keep tracking of jobs
  const jobs = {};
  let jobId = 0;
  
  // get website helper function
  const getSite = (url) => {
    // increase id number and set status to 'pending'
    jobId ++;
    jobs[jobId] = { status: 'pending' };

    // call downloadContent helper function to write file and update status to 'done'
    downloadContent(url, jobId);
    return jobId;
  }

  // download website content helper function
  const downloadContent = (url, jobId) => {
    // write website's html file into sites folder
    const filePath = `./sites/${jobId}.html`;
    const stream = request('http://' + url).pipe(fs.createWriteStream(filePath));

    // after finishing writing into sites folder, update jobs's status to 'done';
    stream.on('finish', function () {
      jobs[jobId].status = 'done';
    });
  }

  // fetch index.html when first load localhost:3000
  app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  // post websites into sites folder and send send job id to client
  app.post('/site/:id', (req, res) => {
    // get job id from get site helper function
    const url = req.param('id');
    const jobId = getSite(url);

    // send job id back to client
    res.send('Your job id is: ' + jobId);
  })

  // fetch html content after status become done
  app.get('/job/:id', (req, res) => {
    // get current job id and job status
    const jobId = req.param('id');
    const job = jobs[jobId];

    // if status is complete, send back html content
    if (job.status === 'done') {
      const filePath = `./sites/${jobId}.html`;
      res.sendFile(path.join(__dirname, filePath));
      // if status is still pending, tell user 'job is pending'
    } else if (job.status === 'pending') {
      res.send('Job is pending...');
      // something went wrong, send 500 status code
    } else {
      res.status(500).send('Something went wrong.')
    }
  })
}
