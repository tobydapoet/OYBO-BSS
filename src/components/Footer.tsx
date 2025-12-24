import { logo_footer } from "../assets/assets";

function Footer() {
  return (
    <div className="bg-black text-white mt-40">
      <div className="md:flex justify-between py-10 px-5">
        <div className="flex gap-12">
          <ul className="list-none space-y-1">
            <h4>CLIENT SERVICES</h4>
            <ul className="mt-2">
              <li>PRODUCT CARE</li>
              <li>DESIGN & CRAFTMANSHIP</li>
              <li>FAQs</li>
            </ul>
          </ul>

          <ul className="list-none space-y-1">
            <h4>COMPANY</h4>
            <ul className="mt-2">
              <li>ABOUT OYBÒ</li>
              <li>CAREERS</li>
              <li>BRAND MANUAL</li>
            </ul>
          </ul>
        </div>

        <div className="flex gap-12 md:mr-30 mt-20 md:mt-0">
          <ul className="list-none space-y-1">
            <h4>LEGAL</h4>
            <ul className="mt-2">
              <li>PRIVACY & COOKIE POLICY</li>
              <li>TERMS OF SERVICE</li>
              <li>REFUND POLICY</li>
            </ul>
          </ul>

          <div className="list-none space-y-1">
            <h4>CONTACTS</h4>

            <ul className="mt-2">
              <li>INSTAGRAM</li>
              <li>INFO@OYBO.IT</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="md:flex items-end justify-between p-2">
        <div>Copyright 2025 ALL RIGHTS RESERVED</div>
        <img src={logo_footer} className="w-170 mt-10 md:mt-0" />
      </div>
    </div>
  );
}

export default Footer;
