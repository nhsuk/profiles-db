# Scripts

See [https://github.com/github/scripts-to-rule-them-all](https://github.com/github/scripts-to-rule-them-all)
for additional background on these scripts.

Below is a list of scripts available, along with a simple description of what
each one does. The details of what they are doing is available within the
script.

[`bootstrap`](bootstrap)
Installs project's direct dependencies e.g. npm packages.

[`ci-deployment`](ci-deployment)
Infrastructure related work.

[`deploy`](deploy)
Clone [ci-deployment](https://github.com/nhsuk/ci-deployment.git) repo and
execute `deploy` script.

[`pre-bootstrap`](pre-bootstrap)
Directs towards base development machine setup.

[`start`](start)
Starts a mongodb instance available on port 27017 after having run the data
merge process.

[`test`](test)
Runs the application's tests.
