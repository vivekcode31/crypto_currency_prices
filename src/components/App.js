import React, { Component } from 'react';
import chart from '../logos/chart.png';
import btc from '../logos/btc.png';
import eth from '../logos/eth.png';
import link from '../logos/link.png';
import ada from '../logos/ada.png';
import xmr from '../logos/xmr.png';
import yfi from '../logos/yfi.png';
import lend from '../logos/lend.png';
import comp from '../logos/comp.png';
import uni from '../logos/uni.png';
import gnt from '../logos/gnt.png';
const axios = require("axios");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ccData: [],
      ccGlobalMcap: '',
      loading: true,
      error: ''
    };
  }

  async componentDidMount() {
    await this.getDataWithRetry();
  }

  delay = (ms) => new Promise((res) => setTimeout(res, ms));

  getDataWithRetry = async (retries = 3, delayMs = 2000) => {
    const headers = {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "coinpaprika1.p.rapidapi.com",
      "x-rapidapi-key": "042025eee7msh0fa3dc58e4d87ccp12648fjsn92428cb6a6bc"
    };

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const [tickersRes, globalRes] = await Promise.all([
          axios.get("https://coinpaprika1.p.rapidapi.com/tickers", { headers }),
          axios.get("https://coinpaprika1.p.rapidapi.com/global", { headers })
        ]);

        const coins = tickersRes.data;
        const ccArray = [
          { name: 'Bitcoin', img: btc },
          { name: 'Ethereum', img: eth },
          { name: 'Chainlink', img: link },
          { name: 'Cardano', img: ada },
          { name: 'Monero', img: xmr },
          { name: 'yearn.finance', img: yfi },
          { name: 'Aave', img: lend },
          { name: 'Compound', img: comp },
          { name: 'Uniswap', img: uni },
          { name: 'Golem', img: gnt }
        ];

        const matchedCoins = [];

        ccArray.forEach(cc => {
          const found = coins.find(c => c.name === cc.name);
          if (found) {
            found.img = cc.img;
            matchedCoins.push(found);
          }
        });

        this.setState({
          ccData: matchedCoins.sort((a, b) => a.rank - b.rank),
          ccGlobalMcap: globalRes.data.market_cap_usd,
          loading: false,
          error: ''
        });

        return; // success, exit loop
      } catch (error) {
        if (error.response && error.response.status === 429 && attempt < retries - 1)
{
          console.warn(`Rate limited. Retrying in ${delayMs}ms...`);
          await this.delay(delayMs);
        } else {
          console.error("API error:", error);
          this.setState({
            error: 'Failed to fetch data. Please try again later.',
            loading: false
          });
          return;
        }
      }
    }
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace text-white">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank" rel="noopener noreferrer">
            <img src={chart} width="30" height="30" className="d-inline-block align-top" alt="" />
            Crypt0 Track3r
          </a>
          {this.state.loading ? (
            <div className="nav-item text-nowrap d-none d-sm-none d-sm-block">Loading...</div>
          ) : this.state.error ? (
            <div className="nav-item text-nowrap d-none d-sm-none d-sm-block text-danger">{this.state.error}</div>
          ) : (
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small>global crypto market:</small>&nbsp;$
              <a className="text-white"
                href="https://coinpaprika.com/market-overview/"
                target="_blank" rel="noopener noreferrer">
                {(this.state.ccGlobalMcap).toLocaleString("fr-CH")}
              </a>
            </li>
          )}
        </nav>
        &nbsp;
        <div className="container-fluid mt-5 w-50 p-3">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {this.state.error ? (
                <div className="text-danger">{this.state.error}</div>
              ) : (
                <table className="table table-striped table-hover table-fixed table-bordered text-monospace">
                  <caption>Data Source: 
                    <a target="_blank" rel="noopener noreferrer" href="https://coinpaprika.com/">coinpaprika</a>
                  </caption>
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Rank</th>
                      <th scope="col">Logo</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.ccData.map((data, key) => (
                      <tr key={key}>
                        <td>{data.rank}</td>
                        <td><img src={data.img} width="25" height="25" className="d-inline-block align-top" alt="" /></td>
                        <td><a target="_blank" rel="noopener noreferrer" href={"https://coinpaprika.com/coin/" + data.id}>{data.name}</a></td>
                        <td>${(data.quotes.USD.price).toFixed(2)}</td>
                        <td>${(data.quotes.USD.market_cap).toLocaleString("fr-CH")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
