const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");


describe("Test Budget", function () {
    
    let Token;
    let Budget;
    let owner;
    let nonowner;
    let result;

    beforeEach(async function () {
        [owner, nonowner] = await ethers.getSigners();

        const MockToken = await ethers.getContractFactory("MockToken");
        Token = await MockToken.deploy();

        const BudgetFactory = await ethers.getContractFactory("Budget");
        Budget = await upgrades.deployProxy(BudgetFactory, [Token.address])

        Token.mint(Budget.address, 100)

    })

    it("Properly shows the balance", async function () {
        expect(await Budget.balance()).to.equal(100);
    });

    it("Reverts when non-owners try to pay from the budget", async function () {
        await expect(Budget.connect(nonowner).pay(nonowner.address, 1)).to.be.revertedWith('Ownable: caller is not the owner');
    })

    describe("When owner pays from the budget", async function () {
        beforeEach(async function () {
            result = Budget.pay(owner.address,1)
        })

        it("Decreases the budget", async function () {
            expect(await Budget.balance()).to.equal(99);
        })

        it("Increases the balance of the payee address", async function () {
            expect(await Token.balanceOf(owner.address)).to.equal(1);
        })

        it("Events a Payment Event", async function () {
            await expect(result)
            .to.emit(Budget, 'Payment')
            .withArgs(owner.address, 1);
        })
    })
  });