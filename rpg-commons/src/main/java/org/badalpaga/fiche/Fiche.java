package org.badalpaga.fiche;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import org.jdom.DocType;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import org.badalpaga.fiche.element.IllegalePath;
import org.badalpaga.fiche.element.Info;
import org.badalpaga.fiche.element.AbstractInfo;
import org.badalpaga.fiche.element.Infos;
import org.badalpaga.fiche.element.Numeric;
import org.badalpaga.fiche.element.AbstractNumeric;
import org.badalpaga.fiche.element.Numerics;
import org.badalpaga.fiche.element.NumericsVal;

/**
 * Classe de gestion d'une ficher de personnage
 * @author cdejean
 *
 */
public class Fiche {

	/**
	 * Nom du jeux auquel associé la fiche
	 */
	private String jeux;
	
	/**
	 * Super liste des informations textuelle du personnage
	 */
	private Infos InformationsTextuelles;
	
	/**
	 * Super liste des informations numerics du personnage
	 */
	private Numerics InformationsNumerics;
	
	/**
	 * Constructeur de fiche vide
	 * @param jeux nom du jeux de la fiche
	 */
	public Fiche(String jeux){
		this.jeux = jeux;
		InformationsTextuelles = new Infos("info");
		InformationsNumerics = new Numerics("numeric");
	}
	
	/**
	 * getter sur le nom du jeux
	 * @return
	 */
	public String getJeux(){
		return this.jeux;
	}

	/**
	 * Getter sur la liste des informations textuelles
	 * @return
	 */
	public Infos getInfos(){
		return InformationsTextuelles;
	}
	
	/**
	 * récupère l'InfoAbstract se trouvant au chemin path
	 * @param path chemin d'accés a l'InfoAbstract
	 * @return InfoAbstract
	 * @throws IllegalePath le chemin d'accès ne pointe sur rien
	 */
	public AbstractInfo getInfo(String path) throws IllegalePath{
		return InformationsTextuelles.getContent(path);
	}
	
	/**
	 * Getter sur la liste des informations textuelles
	 * @return
	 */
	public Numerics getNumerics(){
		return InformationsNumerics;
	}
	
	/**
	 * récupère le NumericAbstract se trouvant au chemin path
	 * @param path chemin d'accés a le NumericAbstract
	 * @return NumericAbstract
	 * @throws IllegalePath le chemin d'accès ne pointe sur rien
	 */
	public AbstractNumeric getNumeric(String path) throws IllegalePath{
		return InformationsNumerics.getContent(path);
	}
	
	/**
	 * Converti l'objet fiche en un fichier xml
	 * @param path nom du futur fichier xml 
	 */
	public void toXML(String path){
		
		Element root = new Element("Fiche");
		Document doc = new Document(root);

		doc.setDocType(new DocType("Fiche", "fiche.dtd"));
		
		root.setAttribute("jeux", jeux);
		
		Element infoTextuelle = new Element("InformationsTextuelles");
		for(AbstractInfo info : InformationsTextuelles.getContents()){
			infoTextuelle.addContent(toElement(info));
		}
		root.addContent(infoTextuelle);
		
		Element infoNumeric = new Element("InformationsNumerics");
		for(AbstractNumeric num : InformationsNumerics.getContents()){
			infoNumeric.addContent(toElement(num));
		}
		root.addContent(infoNumeric);
		
		FileOutputStream fout = null;
		try {
			
			if(!path.endsWith(".xml")){
				path = path + ".xml";
			}
			
			File fichier = new File(path);
			if (!fichier.exists()) {
				fichier.createNewFile();
			}

			Format form = Format.getPrettyFormat();

			XMLOutputter outputter = new XMLOutputter(form);

			fout = new FileOutputStream(fichier);
			outputter.output(doc, fout);
			fout.close();

		} catch (Exception e) {
			e.printStackTrace();
			if (fout != null)
				try {
					fout.close();
				} catch (Exception ee) {
					ee.printStackTrace();
				}
		}
		
	}
	
	/**
	 * Converti un NumericAbstract en Element 
	 * @param num NumericAbstract a convertir
	 * @return Element xml
	 */
	private Element toElement(AbstractNumeric num) {
		Element e;
		if(num instanceof Numeric){
			e = new Element("Numeric");
			if(((Numeric) num).getValeur() != null){
				e.setText(((Numeric) num).getValeur().toString());
			}
			e.setAttribute("nom",num.getNom());
			if(((Numeric) num).isJauge()){
				e.setAttribute("jauge","true");
				if(((Numeric) num).getMax() != null){
					e.setAttribute("max",((Numeric)num).getMax().toString());
				}
			}
		}else if(num instanceof NumericsVal){
			e = new Element("NumericsVal");
			if( ((NumericsVal) num).getValeur() != null){
				e.setAttribute("valeur",((NumericsVal) num).getValeur().toString());
			}
			e.setAttribute("nom",num.getNom());
			if(((NumericsVal) num).isEditable()){
				e.setAttribute("editable","true");
			}
			if(((NumericsVal) num).isJauge()){
				e.setAttribute("jauge","true");
				e.setAttribute("max",((NumericsVal)num).getMax().toString());
			}
			for(AbstractNumeric subNum : ((NumericsVal)num).getContents()){
				e.addContent(toElement(subNum));
			}
		}else{ // num instanceof Numerics
			e = new Element("Numerics");
			e.setAttribute("nom",num.getNom());
			if(((Numerics) num).isEditable()){
				e.setAttribute("editable","true");
			}
			for(AbstractNumeric subNum : ((Numerics)num).getContents()){
				e.addContent(toElement(subNum));
			}
		}
		return e;
	}

	/**
	 * Converti un InfoAbstract en Element 
	 * @param num InfoAbstract a convertir
	 * @return Element xml
	 */
	private Element toElement(AbstractInfo info) {
		Element e;
		if(info instanceof Info){
			e = new Element("Info");
			e.setAttribute("nom",info.getNom());
			e.setText(((Info) info).getValeur());
		}else{ // info instanceof Infos
			e = new Element("Infos");
			e.setAttribute("nom",info.getNom());
			if(((Infos) info).isEditable()){
				e.setAttribute("editable","true");
			}
			for(AbstractInfo subInfo : ((Infos)info).getContents()){
				e.addContent(toElement(subInfo));
			}
		}
		return e;
	}
	
	// -----------------------------------------------------------
	// ----------------------- Static ----------------------------
	// -----------------------------------------------------------
	
	/**
	 * Parse un fiche au format wml dans un objet Fiche
	 * @param fileName
	 * @return
	 * @throws JDOMException
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	public static Fiche parseFicheXML(String fileName) throws JDOMException, IOException{
				
		Document document;
		Element root;
		SAXBuilder sxb = new SAXBuilder(true);

		document = sxb.build(new File(fileName));
		root = document.getRootElement();
		
		Fiche fiche = new Fiche(root.getAttributeValue("jeux"));
		
		// recuperation des information textuelles
		Element infoTextuelle = root.getChild("InformationsTextuelles");
		for(Element e : (List<Element>) infoTextuelle.getChildren() ){
			AbstractInfo tmp;
			if(e.getName().equalsIgnoreCase("Info")){
				tmp = parseInfo(e);
			}else{ // e.getName().equalsIgnoreCase("Infos")
				tmp = parseInfos(e);
			}
			fiche.InformationsTextuelles.addContent(tmp);
		}

		// recuperation des information numerics
		Element infoNumerics = root.getChild("InformationsNumerics");
		for(Element e : (List<Element>) infoNumerics.getChildren() ){
			AbstractNumeric tmp;
			if(e.getName().equalsIgnoreCase("Numeric")){
				tmp = parseNumeric(e);
			}else if(e.getName().equalsIgnoreCase("Numerics")){
				tmp = parseNumerics(e);
			}else{ // e.getName().equalsIgnoreCase("NumericsVal")
				tmp = parseNumericsVal(e);
			}
			fiche.InformationsNumerics.addContent(tmp);
		}
		
		return fiche;
	}

	/**
	 * Convertie un Element en NumericsVal
	 * @param e Element xml a convertir
	 * @return NumericsVal
	 */
	@SuppressWarnings("unchecked")
	private static NumericsVal parseNumericsVal(Element e) {

		NumericsVal num = new NumericsVal(e.getAttributeValue("nom"), Boolean.valueOf(e.getAttributeValue("editable")), Boolean.valueOf(e.getAttributeValue("jauge")));
		if(e.getAttributeValue("max") != null && !e.getAttributeValue("max").isEmpty()){
			num.setMax(Integer.valueOf(e.getAttributeValue("max")));
		}
		if( e.getAttributeValue("valeur")!= null && !e.getAttributeValue("valeur").isEmpty()){
			num.setValeur(Integer.valueOf(e.getAttributeValue("valeur")));
		}
		for(Element subE : (List<Element>) e.getChildren() ){
			AbstractNumeric tmp;
			if(subE.getName().equalsIgnoreCase("Numeric")){
				tmp = parseNumeric(subE);
			}else if(e.getName().equalsIgnoreCase("Numerics")){
				tmp = parseNumerics(subE);
			}else{ // e.getName().equalsIgnoreCase("NumericsVal")
				tmp = parseNumericsVal(subE);
			}
			num.addContent(tmp);
		}
		
		return num;
	}

	/**
	 * Convertie un Element en Numerics
	 * @param e Element xml a convertir
	 * @return Numerics
	 */
	@SuppressWarnings("unchecked")
	private static Numerics parseNumerics(Element e) {
		
		Numerics num = new Numerics(e.getAttributeValue("nom"), Boolean.valueOf(e.getAttributeValue("editable")));
		
		for(Element subE : (List<Element>) e.getChildren() ){
			AbstractNumeric tmp;
			if(subE.getName().equalsIgnoreCase("Numeric")){
				tmp = parseNumeric(subE);
			}else if(subE.getName().equalsIgnoreCase("Numerics")){
				tmp = parseNumerics(subE);
			}else{ // e.getName().equalsIgnoreCase("NumericsVal")
				tmp = parseNumericsVal(subE);
			}
			num.addContent(tmp);
		}
		
		return num;
	}

	/**
	 * Convertie un Element en Numeric
	 * @param e Element xml a convertir
	 * @return Numeric
	 */
	private static AbstractNumeric parseNumeric(Element e) {
		Numeric num = new Numeric(e.getAttributeValue("nom"),Boolean.valueOf(e.getAttributeValue("jauge")));
		if(e.getAttributeValue("max") != null && !e.getAttributeValue("max").isEmpty()){
			num.setMax(Integer.valueOf(e.getAttributeValue("max")));	// vide si la valeur n'est pas présente
		}
		if(!e.getText().isEmpty()){
			num.setValeur(Integer.valueOf(e.getText()));
		}
		return num;
	}
	
	/**
	 * Convertie un Element en Infos
	 * @param e Element xml a convertir
	 * @return Infos
	 */
	@SuppressWarnings("unchecked")
	private static Infos parseInfos(Element e) {
		
		Infos info = new Infos(e.getAttributeValue("nom"), Boolean.valueOf(e.getAttributeValue("editable")));
		
		for(Element subE : (List<Element>) e.getChildren() ){
			AbstractInfo tmp;
			if(subE.getName().equalsIgnoreCase("Info")){
				tmp = parseInfo(subE);
			}else{ // info.getName().equalsIgnoreCase("Infos")
				tmp = parseInfos(subE);
			}
			info.addContent(tmp);
		}
		
		return info;
	}
	
	/**
	 * Convertie un Element en Info
	 * @param e Element xml a convertir
	 * @return Info
	 */
	private static Info parseInfo(Element e) {
		Info info = new Info(e.getAttributeValue("nom"));
		info.setValeur(e.getText());		
		return info;
	}
	
}
