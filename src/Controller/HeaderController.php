<?php


namespace App\Controller;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Attribute\Route;


final class HeaderController extends AbstractController

{
    public function __construct(
        private UrlGeneratorInterface $urlGenerator
    ) {}
    
    #[Route('/header', name: 'app_header')]

    public function index(): Response

    {

        $routes = [

            'accueil' => $this->generateUrl('app_home'),

            'cabinet' => $this->generateUrl('app_cabinet'),

            'particuliers' => [

                'divorce' => $this->generateUrl('app_divorce'),

                'garde' => $this->generateUrl('app_garde'),

                'pension' => $this->generateUrl('app_pension'),

                "travail" => $this->generateUrl('app_travail'),

                "morale"=> $this->generateUrl('app_moral'),

                "solvable"=> $this->generateUrl('app_solvable'),

                "disparue"=> $this->generateUrl('app_disparue'),

            ],

            'ENTREPRISES' => [

                'antecedent' => $this->generateUrl('app_antecedent'),

                'maladie' => $this->generateUrl('app_maladie'),

                'concurrence' => $this->generateUrl('app_concurrence'),

                "personnel" => $this->generateUrl('app_personnel'),

                "vols"=> $this->generateUrl('app_vols'),

                "mystere"=> $this->generateUrl('app_mystere'),

                "espion"=> $this->generateUrl('app_espion'),

                "securite"=> $this->generateUrl('app_securite'),

            ],

            'TARIFS' => $this->generateUrl('app_tarif'),

            'CONTACTS' => $this->generateUrl('app_contact'),

            'ARTICLES' => $this->generateUrl('app_article'),

        ];


        return $this->render('header/index.html.twig', [

            'routes' => $routes

        ]);

    }

}