import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import TextButton from "../ui/TextButton";
import Receipt from "../utils/Receipt";

const HelpButton = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Batch Report",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }

    @media print {
      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }

      .receipt {
        width: 78mm;
        font-family: monospace;
        font-size: 11px;
      }
    }
  `,
  })
  return (<>
    <TextButton onClick={handlePrint}>Help</TextButton>
    <div className="hidden">
      <div
        className="print-area receipt"
        ref={componentRef}
      >
        <Receipt ref={componentRef} title="Instructions">
          <div className="flex flex-col w-full text-left">
            When PC starts up:<br />
            1. Open Oropallos App Shortcut<br />
            2. Sign in with correct register account if prompted<br />
            3. If taken to Oropallos website home screen, click or tap "dashboard" option in navigation bar to be brought to register screen<br />
            4. Customer screen should appear upon entering register. If not, hit the exit button on the left side of the register and go back to register.<br />
            5. Drag the screen over to the customer side and then fullscreen the window.<br />
            6. If you can't sign in and can't get to the sign-in, open the normal chrome app, go to oropallos.com/admin, sign in there, then reopen the oropallos app on the desktop<br /><br />
          </div>

          <div className="flex flex-col w-full text-left">
            Cashing Out:<br />
            1. On the register menu, make sure the cursor on the search bar blinking and the outline is blue.<br />
            2. Scan an item and tap/click on the first item that appears in the table below.<br />
            3. Add whatever quantity, select a discount, and pick Liquor or Wine depending on the product.<br />
            4. Repeat for the rest of the customer's items<br />
            5. If the code is not in the system upon scan, search for it using the search bar. If not found, tap/click on "Register" on the upper right corner and manually enter it. Enter amount and hit @ to add qty, enter price, and discount if applicable. Use the blue button with the left arrow to submit to cart. Note missing item.<br />
            6. To cash out, hit the blue Cash Out button.<br />
            7. Enter in the cash or credit amount and hit the corresponding button to add the amount. The amounts should appear under the number display above.<br />
            8. If exact amount is paid, select cash or credit depending on the method and submit.<br />
            CASH includes: Paper currency, change, gift cards<br />
            CREDIT includes: Credit cards, Debit cards<br />
            <br /><br />
          </div>

          <div className="flex flex-col w-full text-left">
            Voiding:<br />
            1. Use button with spreadsheet logo in left side bar to access manager table.<br />
            2. Find transaction to void by total or timestamp, etc...<br />
            3. Under status column, tap on "Cashed" status to void and "Void" status to undo.<br />
            "Void" - Transactions is currently voided.<br />
            "Cashed" - Transaction is currently in the system.
            <br /><br />
          </div>

          <div className="flex flex-col w-full text-left">
            Reprinting Receipt:<br />
            1. Use button with spreadsheet logo in left side bar to access manager table.<br />
            2. For transactions in current batch: use Current Batch view.<br />
            - Find transaction in table, swipe right and hit "View"<br />
            - Hit "Reprint Receipt" above table that appears. For old batches: use Previous Batches view.<br />
            - Find batch in table.<br />
            - Tap batch in the table and hit "Reprint Receipt" above table that appears.
            <br /><br />
          </div>

          <div className="flex flex-col w-full text-left">
            Closing:<br />
            1. Use X1/Z1 button in left side bar to access closing menu.<br />
            2. Print Report before closing register.<br />
            3. Close batch on card reader first.<br />
            4. Hit "Close Register" button and add card reader total when prompted and submit.
            <br /><br />
          </div>

          <div className="flex flex-col w-full text-left">
            Custom Products:<br />
            1. Tap the "Custom" quick button.<br />
            2. Use search bar to find item to custom add. Tap item that appears to select product.<br />
            3. Add whatever quantity of custom products.<br />
            4. Use num pad to enter number of units in custom product, overall price of the custom product, and discount if applicable.<br />
            5. Select wine or liquor depending on product.<br />
            6. Confirm to add item to cart.<br />
            USES: Overriding product price, adding multi pack with custom price.
            <br /><br />
          </div>

          <div className="flex flex-col w-full text-left">
            Gift Cards:<br />
            1. Tap the "Gift Card" quick button.<br />
            2. Use num pad to enter gift card amount. Add $2 processing fee when paying with card.
            3. Hit confirm to add to cart.<br />
            ONLY USE IF PAYING WITH CARD AND SUBMIT AS CREDIT PAYMENT.<br />
            For simplicity sake, keep Gift Card purchases separate from normal transactions.
            <br /><br />
          </div>
        </Receipt>
      </div>
    </div>
  </>);
}

export default HelpButton;