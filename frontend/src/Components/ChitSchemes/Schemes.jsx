import React from 'react';
import './ChitPlans.css';

const schemes = [
  { name: 'Silver ',  amount: '5000', duration: '20 months', maxBid:'30,000', minBid:'5,000', total: '1,00,000', background: '#1f618d' },
  { name: 'Lily',  amount: '20,000', duration: '20 months', maxBid:'1,20,000', minBid:'6,000', total: '4,00,000', background: '#6c3483'},
  { name: 'Silver ',  amount: '6,000', duration: '25 months', maxBid:'45,000', minBid:'6,000', total: '1,50,000', background: '#117864' },
  { name: 'Gold',  amount: '8,000', duration: '25 months', maxBid:'60,000', minBid:'8,000', total: '2,00,000', background: '#af601a'  },
  { name: 'Jasmine',  amount: '12,000', duration: '25 months', maxBid:'90,000', minBid:'12,000', total: '3,00,000', background: '#7b241c'  },
  { name: 'Lilly',  amount: '40,000', duration: '25 months', maxBid:'1,20,000', minBid:'16,000', total: '4,00,000', background: '#0e6251'  },
  { name: 'Diamond',  amount: '20,000', duration: '25 months', maxBid:'1,50,000', minBid:'20,000', total: '5,00,000', background: '#4a235a'  },
  { name: 'Jasmin',  amount: '10,000', duration: '30 months', maxBid:'90,000', minBid:'12,000', total: '3,00,000', background: '#784212'  },
  { name: 'Marigold',  amount: '20,000', duration: '30 months', maxBid:'1,80,000', minBid:'24,000', total: '6,00,000', background: '#154360'  },
  { name: 'Diamond',  amount: '12,500', duration: '40 months', maxBid:'1,50,000', minBid:'20,000', total: '5,00,000', background: '#186a3b'  },
  { name: 'Suryakanti',  amount: '20,000', duration: '40 months', maxBid:'2,40,000', minBid:'32,000', total: '8,00,000', background: '#6c3483'  },
  { name: 'Platinum',  amount: '25,000', duration: '40 months', maxBid:'3,00,000', minBid:'40,000', total: '10,00,000', background: '#7b241c'  },
  { name: 'Lotus',  amount: '50,000', duration: '40 months', maxBid:'6,00,000', minBid:'80,000', total: '20,00,000', background: '#af601a'  },

];

const Schemes = () => {
  return (
    <section className="schemes-section">
      <div className="schemes-container heading-bx style1">
        <h2 className="title-head-sm text-center mb-4">Aastha Chit Schemes</h2>
        <table className="schemes-table">
          <thead>
            <tr>
              <th>Plan Name</th>             
              <th>Monthly Amount</th>
              <th>Min Bidding</th>
              <th>Max Bidding</th>             
              <th>Duration</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme, index) => (
              <tr key={index} style={{background: scheme.background}}>
                <td style={{fontSize: 18, fontWeight:800}}>{scheme.name}</td>                
                <td style={{fontSize: 18, fontWeight:800}}>₹{scheme.amount.toLocaleString()}</td>
                <td>₹{scheme.minBid}</td>
                <td>₹{scheme.maxBid}</td>
                <td>{scheme.duration}</td>
                <td style={{fontSize: 18, fontWeight:800}}>₹{scheme.total} /-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Schemes;
