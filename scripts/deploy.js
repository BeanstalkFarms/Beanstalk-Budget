const BEAN_ADDRESS = '0xDC59ac4FeFa32293A95889Dc396682858d52e5Db'
const BEANSTALK_ADDRESS = '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5'
const DEVELOPMENT_ADDRESS = '0x83A758a6a24FE27312C1f8BDa7F3277993b64783'
const MARKETING_ADDRESS = '0xAA420e97534aB55637957e868b658193b112A551'

async function main() {
  const BudgetFactory = await ethers.getContractFactory("Budget");
  const DevelopmentBudget = await upgrades.deployProxy(BudgetFactory, [BEAN_ADDRESS, BEANSTALK_ADDRESS]);
  await DevelopmentBudget.deployed();
  console.log("Development Budget deployed to:", DevelopmentBudget.address);

  const MarketingBudget = await upgrades.deployProxy(BudgetFactory, [BEAN_ADDRESS, BEANSTALK_ADDRESS]);
  await MarketingBudget.deployed();
  console.log("Marketing Budget deployed to:", MarketingBudget.address);
}

async function upgrade() {
  let budget;
  const BudgetFactory = await ethers.getContractFactory("Budget");
  budget = await upgrades.upgradeProxy(DEVELOPMENT_ADDRESS, BudgetFactory);
  await (await budget.setBeanstalk(BEANSTALK_ADDRESS.address)).wait()

  const BudgetFactory = await ethers.getContractFactory("Budget");
  budget = await upgrades.upgradeProxy(MARKETING_ADDRESS, BudgetFactory);
  await (await budget.setBeanstalk(BEANSTALK_ADDRESS.address)).wait()
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