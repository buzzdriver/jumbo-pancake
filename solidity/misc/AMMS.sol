// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
*********************** Overview ***********************
Constant Product AMM: 
X * Y = K
Three key algorithms to figure out: (formula breakdown in comments)
(1) num token to return when swapping
(2) shares to mint when adding liquidity: what is dy given dx and vice versa
(3) tokens to withdraw when removing liquidity

Constant Sum AMM:
X + Y = K
one-to-one bidirectional swap
********************************************************
*/

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed spender, uint amount);
}

contract ConstantProductAMM {
    IERC20 public immutable token0;
    IERC20 public immutable token1;
    uint public reserve0;
    uint public reserve1;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function _mint(address _to, uint _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint _reserve0, uint _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }

    function swap(address _tokenIn, uint _amountIn)
        external
        returns (uint amountOut)
    {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "Invalid token"
        );
        require(_amountIn > 0, "Amount cannot be zero");
        bool isToken0 = _tokenIn == address(token0);
        (
            IERC20 tokenIn,
            IERC20 tokenOut,
            uint reserveIn,
            uint reserveOut
        ) = isToken0
                ? (token0, token1, reserve0, reserve1)
                : (token1, token0, reserve1, reserve0);

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);
        /*
        xy = k, before swap
        (x + dx)(y - dy) = k, after swap
        y - dy = k / (x + dx)
        y - k / (x + dx) = dy
        y - xy / (x + dx) = dy
        (yx + ydx - xy) / (x + dx) = dy
        ydx / (x + dx) = dy
        */
        uint amountInWithFee = (_amountIn * 997) / 1000;
        amountOut =
            (reserveOut * amountInWithFee) /
            (reserveIn + amountInWithFee);
        tokenOut.transfer(msg.sender, amountOut);
        _update(
            token0.balanceOf(address(this)),
            token1.balanceOf(address(this))
        );
    }

    function addLiquidity(uint _amount0, uint _amount1)
        external
        returns (uint shares)
    {
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);
        /*
        xy = k
        (x + dx)(y + dy) = k', k<=k'
        x / y = (x + dx) / (y + dy), constraint: no price change before and after adding liquidity
        x(y + dy) = y(x + dx)
        x * dy = y * dx
        x / y = dx / dy
        dy = y / x * dx
        */
        if (reserve0 > 0 || reserve1 > 0) {
            require(
                reserve0 * _amount1 == reserve1 * _amount0,
                "x / y != dx / dy"
            );
        }
        /*
        f(x, y) = value of liquidity, can use sqrt(xy) since constant product should establish linear behavior
        L0 = f(x, y), total liq before
        L1 = f(x + dx, y + dy), total liq after
        T = total shares
        s = shares to mint
        L1 / L0 = (T + s) / T
        L1 * T = L0 * (T + s)
        (L1 - L0) * T / L0 = s
        (L1 - L0) / L0 = dx / x = dy / y
        */
        if (totalSupply == 0) {
            shares = _sqrt(_amount0 * _amount1);
        } else {
            shares = _min(
                (_amount0 * totalSupply) / reserve0,
                (_amount1 * totalSupply) / reserve1
            );
        }
        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);
        _update(
            token0.balanceOf(address(this)),
            token1.balanceOf(address(this))
        );
    }

    function removeLiquidity(uint _shares)
        external
        returns (uint amount0, uint amount1)
    {
        /*
        dx, dy = amount of liquidity to remove
        dx = s / T * x
        dy = s / T * y
        bal0 >= reserve0
        bal1 >= reserve1
        */
        uint bal0 = token0.balanceOf(address(this));
        uint bal1 = token1.balanceOf(address(this));
        amount0 = (_shares * bal0) / totalSupply;
        amount1 = (_shares * bal1) / totalSupply;
        require(
            amount0 > 0 && amount1 > 0,
            "Amount0 or amount1 cannot be zero"
        );
        _burn(msg.sender, _shares);
        _update(bal0 - amount0, bal1 - amount1);
        token0.transfer(msg.sender, amount0);
        token1.transfer(msg.sender, amount1);
    }

    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
}

contract ConstantSumAMM {
    IERC20 public immutable token0;
    IERC20 public immutable token1;
    uint public reserve0;
    uint public reserve1;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function _mint(address _to, uint _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint _res0, uint _res1) private {
        reserve0 = _res0;
        reserve1 = _res1;
    }

    function swap(address _tokenIn, uint _amountIn)
        external
        returns (uint amountOut)
    {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "invalid token"
        );
        bool isToken0 = _tokenIn == address(token0);
        (IERC20 tokenIn, IERC20 tokenOut, uint resIn, uint resOut) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);
        uint amountIn = tokenIn.balanceOf(address(this)) - resIn;
        amountOut = (amountIn * 997) / 1000;
        (uint res0, uint res1) = isToken0
            ? (resIn + amountIn, resOut - amountOut)
            : (resOut - amountOut, resIn + amountIn);
        _update(res0, res1);
        tokenOut.transfer(msg.sender, amountOut);
    }

    function addLiquidity(uint _amount0, uint _amount1)
        external
        returns (uint shares)
    {
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);
        uint bal0 = token0.balanceOf(address(this));
        uint bal1 = token1.balanceOf(address(this));
        uint d0 = bal0 - reserve0;
        uint d1 = bal1 - reserve1;
        /*
        a = amount in
        L = total liquidity
        s = shares to mint
        T = total supply
        (L + a) / L = (T + s) / T
        s = a * T / L
        */
        if (totalSupply > 0) {
            shares = ((d0 + d1) * totalSupply) / (reserve0 + reserve1);
        } else {
            shares = d0 + d1;
        }
        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);
        _update(bal0, bal1);
    }

    function removeLiquidity(uint _shares) external returns (uint d0, uint d1) {
        /*
        a = amount out
        L = total liquidity
        s = shares
        T = total supply
        a / L = s / T
        a = L * s / T
          = (reserve0 + reserve1) * s / T
        */
        d0 = (reserve0 * _shares) / totalSupply;
        d1 = (reserve1 * _shares) / totalSupply;
        _burn(msg.sender, _shares);
        _update(reserve0 - d0, reserve1 - d1);
        if (d0 > 0) {
            token0.transfer(msg.sender, d0);
        }
        if (d1 > 0) {
            token1.transfer(msg.sender, d1);
        }
    }
}
