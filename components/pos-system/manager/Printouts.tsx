import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import Receipt from "@/components/utils/Receipt";
import TextButton from "@/components/ui/TextButton";
import { useRef } from "react";
import HelpButton from "../HelpButton";

const Printouts = () => {
  const miniListRef = useRef<HTMLDivElement>(null);

  const handlePrintMiniList = useReactToPrint({
    contentRef: miniListRef,
    documentTitle: "Transaction Receipt",
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

  const miniPackList = (
    <Receipt ref={miniListRef}>
      <h1 className="font-semibold w-full text-left">
        Mini Pack List
      </h1>
      <table className="w-full border-separate border-spacing-y-2">
        <thead className="top-0 text-left text-md">
          <tr>
            <th>
              Product
            </th>
            <th>
              Qty
            </th>
          </tr>
        </thead>

        <tbody className="text-md">
          <tr>
            <td>
              Captain Morgan<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Root Beer<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Espresso<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Red White Berry<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Caramel<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Blueberry<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Raspberry<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff 80 Proof<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Orange<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Smirnoff Vanilla<br />10 X 50mL
            </td>
            <td />
          </tr>
          <tr>
            <td>
              ______________________________________
            </td>
          </tr>
          <tr>
            <td>
              Fireball Apple<br />10 X 50mL
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </Receipt>
  );
  return (
    <>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="flex flex-col w-full h-full items-center justify-start gap-5 divide-y divide-zinc-400">
          {/* Header */}
          <div className="flex w-full flex-col">
            <h1
              className="flex w-full text-xl sm:text-2xl font-serif font-semibold text-start text-zinc-900 px-15">
              Printouts
            </h1>
            <h1
              className="flex w-full text-lg sm:text-xl font-serif text-start text-zinc-900 pb-4 px-15">
              Print reusable documentation
            </h1>
          </div>
          <div className="flex flex-col w-[80vw] items-start overflow-hidden rounded-md text-zinc-800 divide-y divide-zinc-400">
            <div className="p-5 w-[80vw]">
              <TextButton
                onClick={handlePrintMiniList}
              >
                Print Mini List
              </TextButton>
              <div>Print list packs that need to be taken out as 10 packs and readded as singles</div>
            </div>
            <div className="p-5 w-[80vw]">
              <HelpButton />
              <div>Print instructions on operating the system</div>
            </div>
          </div>

          <div className="hidden" >
            <div className="print-area" ref={miniListRef} >
              {miniPackList}
            </div>
          </div>
        </div>

      </motion.div>
    </>
  );
}

export default Printouts;