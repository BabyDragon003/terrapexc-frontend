import { React, useState, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import { Tabs, Tab } from 'react-bootstrap';
import { PAIR_LIST } from '../utils/constants';

export default function MarketPairs() {
  const [favouriteList, setFavouriteList] = useState([]);
  const navigate = useNavigate();
  const handleGo = (pair) => {
    navigate('/exchange/' + pair?.to?.symbol + '-' + pair?.from?.symbol);
  }

  useEffect(() => {
    let favouritePairList = JSON.parse(localStorage.getItem('favouritePair'));
    if (!favouritePairList) {
      favouritePairList = [];
    }
    setFavouriteList(favouritePairList);
  }, []);

      <div className="market-pairs">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              <i className="icon ion-md-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
        <Tabs defaultActiveKey="lunc">
          <Tab eventKey="star" title="★">
            <table className="table star-active">
              <thead>
                <tr>
                  <th>Pairs</th>
                  <th className='tw-whitespace-nowrap'>Last Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {favouriteList?.map((pair_id) => (
                  <tr>
                    <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[pair_id])}>
                      <i className="icon ion-md-star" onClick={(e) => {
                        e.stopPropagation();
                        addFavourite(pair_id);
                      }}></i> {PAIR_LIST[pair_id].to.symbol}/{PAIR_LIST[pair_id].from.symbol}
                    </td>
                    <td>0.00020255</td>
                    <td className="red">-2.58%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="lunc" title="tLUNC">
            <table className="table">
              <thead>
                <tr>
                  <th>Pairs</th>
                  <th className='tw-whitespace-nowrap'>Last Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[0])}>
                    <i className={favouriteList.includes(0) ? "icon ion-md-star !tw-text-blue-500" : "icon ion-md-star"} onClick={(e) => {
                      e.stopPropagation();
                      addFavourite(0);
                    }}></i> tLUNC/CUST
                  </td>
                  <td>0.00020255</td>
                  <td className="red">-2.58%</td>
                </tr>
                <tr>
                  <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[1])}>
                    <i className={favouriteList.includes(1) ? "icon ion-md-star !tw-text-blue-500" : "icon ion-md-star"} onClick={(e) => {
                      e.stopPropagation();
                      addFavourite(1);
                    }}></i> tLUNC/TLF
                  </td>
                  <td>0.00013192</td>
                  <td className="green">+5.6%</td>
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="cust" title="CUST">
            <table className="table">
              <thead>
                <tr>
                  <th>Pairs</th>
                  <th className='tw-whitespace-nowrap'>Last Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[0])}>
                    <i className={favouriteList.includes(0) ? "icon ion-md-star !tw-text-blue-500" : "icon ion-md-star"} onClick={(e) => {
                      e.stopPropagation();
                      addFavourite(0);
                    }}></i> tLUNC/CUST
                  </td>
                  <td>0.00020255</td>
                  <td className="green">+1.58%</td>
                </tr>
                <tr>
                  <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[2])}>
                    <i className={favouriteList.includes(2) ? "icon ion-md-star !tw-text-blue-500" : "icon ion-md-star"} onClick={(e) => {
                      e.stopPropagation();
                      addFavourite(2);
                    }}></i> CUST/TLF
                  </td>
                  <td>0.00013192</td>
                  <td className="red">-0.6%</td>
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="tlf" title="TLF">
            <table className="table">
              <thead>
                <tr>
                  <th>Pairs</th>
                  <th className='tw-whitespace-nowrap'>Last Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[1])}>
                    <i className={favouriteList.includes(1) ? "icon ion-md-star !tw-text-blue-500" : "icon ion-md-star"} onClick={(e) => {
                      e.stopPropagation();
                      addFavourite(1);
                    }}></i> tLUNC/TLF
                  </td>
                  <td>0.00020255</td>
                  <td className="green">+1.58%</td>
                </tr>
                <tr>
                  <td className='tw-whitespace-nowrap' onClick={() => handleGo(PAIR_LIST[2])}>
                    <i className={favouriteList.includes(2) ? "icon ion-md-star !tw-text-blue-500" : "icon ion-md-star"} onClick={(e) => {
                      e.stopPropagation();
                      addFavourite(2);
                    }}></i> CUST/TLF
                  </td>
                  <td>0.00013192</td>
                  <td className="red">-0.6%</td>
                </tr>
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
