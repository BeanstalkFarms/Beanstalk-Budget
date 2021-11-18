const BEAN_ADDRESS = '0xDC59ac4FeFa32293A95889Dc396682858d52e5Db'
const BEANSTALK_ADDRESS = '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5'
const DEVELOPMENT_ADDRESS = '0x83A758a6a24FE27312C1f8BDa7F3277993b64783'
const MARKETING_ADDRESS = '0xAA420e97534aB55637957e868b658193b112A551'

function addCommas (nStr) {
  nStr += ''
  const x = nStr.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}

function strDisplay (str) {
  return addCommas(str.toString())
}

async function main() {
  const BudgetFactory = await ethers.getContractFactory("Budget");
  const budget = await upgrades.deployProxy(BudgetFactory, [BEAN_ADDRESS, BEANSTALK_ADDRESS]);
  console.log(budget.deployTransaction);
  const receipt = await budget.deployTransaction.wait();
  console.log("Budget deployed to:", budget.address);
  console.log(`Gas used: ${strDisplay(receipt.gasUsed)}`);
}

async function upgrade(account) {
  const BudgetFactory = await ethers.getContractFactory("Budget");
  budget = await upgrades.upgradeProxy(MARKETING_ADDRESS, BudgetFactory);
  console.log("Marketing Address Upgraded deployed to:", MARKETING_ADDRESS);
  await (await budget.setBeanstalk(BEANSTALK_ADDRESS)).wait()
  console.log("Beanstalk Address set to ", BEANSTALK_ADDRESS);

  budget = await upgrades.upgradeProxy(DEVELOPMENT_ADDRESS, BudgetFactory);
  console.log("Marketing Address Upgraded deployed to:", DEVELOPMENT_ADDRESS);
  await (await budget.setBeanstalk(BEANSTALK_ADDRESS)).wait()
  console.log("Beanstalk Address set to ", BEANSTALK_ADDRESS);
}

if (require.main === module) {
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
  }
  exports.deploy = main
  exports.upgrade = upgrade